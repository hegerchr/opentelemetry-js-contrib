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
import { expect } from 'expect';
import { PolicyStore } from '../../src/store/PolicyStore';
import { TraceSamplingRatePolicy } from '../../src/policy/TraceSamplingRatePolicy';
import { TelemetryPolicy } from '../../src/policy/TelemetryPolicy';
import type { PolicyImplementer } from '../../src/implementer/PolicyImplementer';
import { TraceSamplingValidator } from '../../src/validator/TraceSamplingValidator';

describe('PolicyStore', () => {
  it('notifies implementer on new policy', () => {
    const store = new PolicyStore();
    const received: TelemetryPolicy[] = [];
    const impl: PolicyImplementer = { getValidators: () => [new TraceSamplingValidator()], onPoliciesChanged: (policies) => received.push(...policies) };
    store.registerImplementer(impl);
    store.updatePolicies('source1', [new TraceSamplingRatePolicy(0.5)]);
    expect(received.length).toBe(1);
    expect(received[0]).toBeInstanceOf(TraceSamplingRatePolicy);
  });
  it('does not re-notify for same policy', () => {
    const store = new PolicyStore();
    const received: TelemetryPolicy[] = [];
    const impl: PolicyImplementer = { getValidators: () => [new TraceSamplingValidator()], onPoliciesChanged: (policies) => received.push(...policies) };
    store.registerImplementer(impl);
    store.updatePolicies('source1', [new TraceSamplingRatePolicy(0.5)]);
    store.updatePolicies('source1', [new TraceSamplingRatePolicy(0.5)]);
    expect(received.length).toBe(1);
  });
  it('notifies on policy change', () => {
    const store = new PolicyStore();
    const received: TelemetryPolicy[] = [];
    const impl: PolicyImplementer = { getValidators: () => [new TraceSamplingValidator()], onPoliciesChanged: (policies) => received.push(...policies) };
    store.registerImplementer(impl);
    store.updatePolicies('source1', [new TraceSamplingRatePolicy(0.5)]);
    store.updatePolicies('source1', [new TraceSamplingRatePolicy(0.8)]);
    expect(received.length).toBe(2);
    expect((received[1] as TraceSamplingRatePolicy).probability).toBe(0.8);
  });
  it('emits sentinel on policy removal', () => {
    const store = new PolicyStore();
    const received: TelemetryPolicy[] = [];
    const impl: PolicyImplementer = { getValidators: () => [new TraceSamplingValidator()], onPoliciesChanged: (policies) => received.push(...policies) };
    store.registerImplementer(impl);
    store.updatePolicies('source1', [new TraceSamplingRatePolicy(0.5)]);
    store.updatePolicies('source1', []);
    expect(received.length).toBe(2);
    expect(received[1].constructor).toBe(TelemetryPolicy);
  });
});
