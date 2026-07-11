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
import { OpampPollingIntervalPolicyImplementer } from '../../src/implementer/OpampPollingIntervalPolicyImplementer';
import { OpampPollingIntervalPolicy } from '../../src/policy/OpampPollingIntervalPolicy';
import { TelemetryPolicy } from '../../src/policy/TelemetryPolicy';

describe('OpampPollingIntervalPolicyImplementer', () => {
  it('has OpampPollingIntervalValidator', () => {
    const impl = new OpampPollingIntervalPolicyImplementer();
    expect(impl.getValidators()[0].getPolicyType()).toBe('OpampPollingIntervalPolicy');
  });
  it('calls setPollingInterval on provider', () => {
    let called = 0; let calledWith = 0;
    const provider = { setPollingInterval: (ms: number) => { called++; calledWith = ms; } };
    const impl = new OpampPollingIntervalPolicyImplementer(provider);
    impl.onPoliciesChanged([new OpampPollingIntervalPolicy(5000)]);
    expect(called).toBe(1); expect(calledWith).toBe(5000);
  });
  it('resets to default on bare TelemetryPolicy sentinel', () => {
    let calledWith = 0;
    const provider = { setPollingInterval: (ms: number) => { calledWith = ms; } };
    const impl = new OpampPollingIntervalPolicyImplementer(provider);
    impl.onPoliciesChanged([new TelemetryPolicy('OpampPollingIntervalPolicy')]);
    expect(calledWith).toBe(30000);
  });
  it('does nothing when no provider', () => {
    const impl = new OpampPollingIntervalPolicyImplementer();
    expect(() => impl.onPoliciesChanged([new OpampPollingIntervalPolicy(5000)])).not.toThrow();
  });
});
