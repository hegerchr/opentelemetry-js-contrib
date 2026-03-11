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

import { TelemetryPolicy } from '../policy/TelemetryPolicy.js';
import { OpampPollingIntervalPolicy } from '../policy/OpampPollingIntervalPolicy.js';
import { OpampPollingIntervalValidator } from '../validator/OpampPollingIntervalValidator.js';
import type { PolicyValidator } from '../validator/PolicyValidator.js';
import type { PolicyImplementer } from './PolicyImplementer.js';

export interface PollingIntervalSettable {
  setPollingInterval(ms: number): void;
}

const DEFAULT_POLLING_INTERVAL_MS = 30000;

export class OpampPollingIntervalPolicyImplementer implements PolicyImplementer {
  private provider: PollingIntervalSettable | null = null;

  constructor(provider?: PollingIntervalSettable) {
    if (provider) {
      this.provider = provider;
    }
  }

  setProvider(provider: PollingIntervalSettable): void {
    this.provider = provider;
  }

  getValidators(): PolicyValidator[] {
    return [new OpampPollingIntervalValidator()];
  }

  onPoliciesChanged(policies: TelemetryPolicy[]): void {
    for (const policy of policies) {
      if (policy instanceof OpampPollingIntervalPolicy) {
        this.provider?.setPollingInterval(policy.intervalMs);
      } else if (policy.constructor === TelemetryPolicy) {
        this.provider?.setPollingInterval(DEFAULT_POLLING_INTERVAL_MS);
      }
    }
  }
}
