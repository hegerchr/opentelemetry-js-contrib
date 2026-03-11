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

import type { PolicyImplementer } from '../implementer/PolicyImplementer.js';
import type { TelemetryPolicy } from '../policy/TelemetryPolicy.js';
import { TelemetryPolicy as TelemetryPolicyClass } from '../policy/TelemetryPolicy.js';

function serializePolicy(policy: TelemetryPolicy): string {
  return JSON.stringify(policy);
}

export class PolicyStore {
  private readonly implementers: Map<PolicyImplementer, Set<string>> = new Map();
  private readonly mergedPolicies: Map<string, TelemetryPolicy> = new Map();
  private readonly sourcePolicies: Map<string, TelemetryPolicy[]> = new Map();

  registerImplementer(impl: PolicyImplementer): void {
    this.implementers.set(impl, new Set());
  }

  updatePolicies(sourceId: string, newPolicies: TelemetryPolicy[]): void {
    this.sourcePolicies.set(sourceId, newPolicies);

    this.mergedPolicies.clear();
    for (const [, policies] of this.sourcePolicies) {
      for (const policy of policies) {
        this.mergedPolicies.set(policy.type, policy);
      }
    }

    for (const [impl, lastSeen] of this.implementers) {
      const validatorTypes = new Set(impl.getValidators().map(v => v.getPolicyType()));

      const relevantPolicies = new Map<string, TelemetryPolicy>();
      for (const [type, policy] of this.mergedPolicies) {
        if (validatorTypes.has(type)) {
          relevantPolicies.set(type, policy);
        }
      }

      const delta: TelemetryPolicy[] = [];
      const currentSerialized = new Set<string>();

      for (const [type, policy] of relevantPolicies) {
        const serialized = serializePolicy(policy);
        const key = type + ':' + serialized;
        currentSerialized.add(key);
        if (!lastSeen.has(key)) {
          delta.push(policy);
        }
      }

      for (const seen of lastSeen) {
        const type = seen.split(':')[0];
        if (!relevantPolicies.has(type)) {
          delta.push(new TelemetryPolicyClass(type));
        }
      }

      if (delta.length > 0) {
        impl.onPoliciesChanged(delta);
        this.implementers.set(impl, currentSerialized);
      }
    }
  }
}
