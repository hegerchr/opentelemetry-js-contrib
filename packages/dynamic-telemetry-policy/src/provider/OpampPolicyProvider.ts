/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { PolicyProvider } from './PolicyProvider';
import type { PolicyValidator } from '../validator/PolicyValidator';
import type { TelemetryPolicy } from '../policy/TelemetryPolicy';
import { parseSource, SourceFormat } from '../source/SourceFormat';
import { JsonSourceWrapper } from '../source/JsonSourceWrapper';
import type { SourceWrapper } from '../source/SourceWrapper';

export interface OpampPolicyProviderOptions {
  endpoint: string;
  locationKey: string;
  pollingIntervalMs?: number;
  sourceKeyToPolicyType?: Map<string, string>;
  validators: Map<string, PolicyValidator>;
  serviceName?: string;
  serviceEnvironment?: string;
}

export class OpampPolicyProvider implements PolicyProvider {
  private readonly endpoint: string;
  private readonly locationKey: string;
  private pollingIntervalMs: number;
  private readonly sourceKeyToPolicyType: Map<string, string>;
  private readonly validators: Map<string, PolicyValidator>;
  private readonly serviceName: string;
  private readonly serviceEnvironment: string;
  private lastPolicies: TelemetryPolicy[] = [];
  private intervalHandle: ReturnType<typeof setInterval> | null = null;

  constructor(options: OpampPolicyProviderOptions) {
    this.endpoint = options.endpoint.replace(/\/$/, '');
    this.locationKey = options.locationKey;
    this.pollingIntervalMs = options.pollingIntervalMs ?? 30000;
    this.sourceKeyToPolicyType = options.sourceKeyToPolicyType ?? new Map();
    this.validators = options.validators;
    this.serviceName = options.serviceName ?? '';
    this.serviceEnvironment = options.serviceEnvironment ?? '';
  }

  fetchPolicies(): TelemetryPolicy[] {
    return this.lastPolicies;
  }

  setPollingInterval(ms: number): void {
    this.pollingIntervalMs = ms;
  }

  startWatching(callback: (policies: TelemetryPolicy[]) => void): () => void {
    const poll = async () => {
      try {
        const policies = await this.doPoll();
        this.lastPolicies = policies;
        callback(policies);
      } catch {
        // Ignore errors
      }
    };

    this.intervalHandle = setInterval(() => {
      void poll();
    }, this.pollingIntervalMs);

    return () => {
      if (this.intervalHandle !== null) {
        clearInterval(this.intervalHandle);
        this.intervalHandle = null;
      }
    };
  }

  private async doPoll(): Promise<TelemetryPolicy[]> {
    const url = `${this.endpoint}/v1/opamp`;
    const body = JSON.stringify({
      agent_description: {
        identifying_attributes: [
          { key: 'service.name', value: { string_value: this.serviceName } },
          { key: 'deployment.environment', value: { string_value: this.serviceEnvironment } },
        ],
      },
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as {
      remote_config?: {
        config?: {
          config_map?: Record<string, { body?: string }>;
        };
      };
    };

    const configMap = data?.remote_config?.config?.config_map;
    if (!configMap) {
      return [];
    }

    const locationData = configMap[this.locationKey];
    if (!locationData?.body) {
      return [];
    }

    const content = Buffer.from(locationData.body, 'base64').toString('utf-8');
    return this.parseContent(content);
  }

  private parseContent(content: string): TelemetryPolicy[] {
    const policies: TelemetryPolicy[] = [];

    let wrappers: SourceWrapper[] | null = parseSource(SourceFormat.JSON, content);
    if (!wrappers) {
      wrappers = this.parseMappedJsonObject(content);
    }

    if (!wrappers) {
      return policies;
    }

    for (const wrapper of wrappers) {
      let policyType = wrapper.getPolicyType();
      const remapped = this.sourceKeyToPolicyType.get(policyType);
      if (remapped) {
        policyType = remapped;
      }
      const validator = this.validators.get(policyType);
      if (validator) {
        const policy = validator.validate(wrapper);
        if (policy !== null) {
          policies.push(policy);
        }
      }
    }

    return policies;
  }

  private parseMappedJsonObject(content: string): SourceWrapper[] | null {
    try {
      const parsed = JSON.parse(content) as Record<string, unknown>;
      if (typeof parsed !== 'object' || Array.isArray(parsed)) {
        return null;
      }
      const wrappers: SourceWrapper[] = [];
      const keys = this.sourceKeyToPolicyType.size > 0
        ? Array.from(this.sourceKeyToPolicyType.keys())
        : Object.keys(parsed);

      for (const key of keys) {
        if (key in parsed) {
          wrappers.push(new JsonSourceWrapper({ [key]: parsed[key] }));
        }
      }
      return wrappers.length > 0 ? wrappers : null;
    } catch {
      return null;
    }
  }
}
