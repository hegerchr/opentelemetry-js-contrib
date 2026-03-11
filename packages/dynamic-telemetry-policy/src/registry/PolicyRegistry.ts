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

import type { PolicyInitConfig } from '../config/PolicyInitConfig';
import { PolicyInitConfigReader } from '../config/PolicyInitConfigReader';
import { PolicyStore } from '../store/PolicyStore';
import { LinePerPolicyFileProvider } from '../provider/LinePerPolicyFileProvider';
import { OpampPolicyProvider } from '../provider/OpampPolicyProvider';
import { TraceSamplingRatePolicyImplementer } from '../implementer/TraceSamplingRatePolicyImplementer';
import { TraceExportEnabledPolicyImplementer } from '../implementer/TraceExportEnabledPolicyImplementer';
import { MetricExportEnabledPolicyImplementer } from '../implementer/MetricExportEnabledPolicyImplementer';
import { LogExportEnabledPolicyImplementer } from '../implementer/LogExportEnabledPolicyImplementer';
import { OpampPollingIntervalPolicyImplementer } from '../implementer/OpampPollingIntervalPolicyImplementer';
import { TraceSamplingValidator } from '../validator/TraceSamplingValidator';
import { TraceExportEnabledValidator } from '../validator/TraceExportEnabledValidator';
import { MetricExportEnabledValidator } from '../validator/MetricExportEnabledValidator';
import { LogExportEnabledValidator } from '../validator/LogExportEnabledValidator';
import { OpampPollingIntervalValidator } from '../validator/OpampPollingIntervalValidator';
import type { PolicyValidator } from '../validator/PolicyValidator';
import type { PolicyImplementer } from '../implementer/PolicyImplementer';

type PolicyRegistryEntry = {
  createValidator(): PolicyValidator;
  createImplementer(): PolicyImplementer;
};

const REGISTRY = new Map<string, PolicyRegistryEntry>([
  ['TraceSamplingRatePolicy', {
    createValidator: () => new TraceSamplingValidator(),
    createImplementer: () => new TraceSamplingRatePolicyImplementer(),
  }],
  ['TraceExportEnabledPolicy', {
    createValidator: () => new TraceExportEnabledValidator(),
    createImplementer: () => new TraceExportEnabledPolicyImplementer(),
  }],
  ['MetricExportEnabledPolicy', {
    createValidator: () => new MetricExportEnabledValidator(),
    createImplementer: () => new MetricExportEnabledPolicyImplementer(),
  }],
  ['LogExportEnabledPolicy', {
    createValidator: () => new LogExportEnabledValidator(),
    createImplementer: () => new LogExportEnabledPolicyImplementer(),
  }],
  ['OpampPollingIntervalPolicy', {
    createValidator: () => new OpampPollingIntervalValidator(),
    createImplementer: () => new OpampPollingIntervalPolicyImplementer(),
  }],
]);

export class PolicyRegistry {
  static init(configFilePath?: string): void {
    const filePath = configFilePath ?? process.env['OTEL_DYNAMIC_TELEMETRY_POLICY_CONFIG'];
    if (!filePath) {
      return;
    }

    const reader = new PolicyInitConfigReader();
    const config = reader.read(filePath);
    PolicyRegistry.initFromConfig(config);
  }

  static initFromConfig(config: PolicyInitConfig): void {
    const store = new PolicyStore();

    const allPolicyTypes = new Set<string>();
    for (const source of config.sources) {
      for (const mapping of source.mappings) {
        allPolicyTypes.add(mapping.policyType);
      }
    }

    for (const policyType of allPolicyTypes) {
      const entry = REGISTRY.get(policyType);
      if (entry) {
        const impl = entry.createImplementer();
        store.registerImplementer(impl);
      }
    }

    for (let i = 0; i < config.sources.length; i++) {
      const source = config.sources[i];
      const sourceId = `source-${i}`;

      const validators = new Map<string, PolicyValidator>();
      const sourceKeyToPolicyType = new Map<string, string>();

      for (const mapping of source.mappings) {
        const entry = REGISTRY.get(mapping.policyType);
        if (entry) {
          validators.set(mapping.policyType, entry.createValidator());
          sourceKeyToPolicyType.set(mapping.sourceKey, mapping.policyType);
        }
      }

      let provider;
      if (source.kind === 'file') {
        provider = new LinePerPolicyFileProvider(source.location, validators);
      } else if (source.kind === 'opamp') {
        provider = new OpampPolicyProvider({
          endpoint: source.location || 'http://localhost:4320',
          locationKey: '',
          validators,
          sourceKeyToPolicyType,
        });
      } else {
        continue;
      }

      provider.startWatching(policies => {
        store.updatePolicies(sourceId, policies);
      });
      store.updatePolicies(sourceId, provider.fetchPolicies());
    }
  }
}
