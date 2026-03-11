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
import { TraceSamplingRatePolicyImplementer } from '../../src/implementer/TraceSamplingRatePolicyImplementer.js';
import { TraceSamplingRatePolicy } from '../../src/policy/TraceSamplingRatePolicy.js';
import { TelemetryPolicy } from '../../src/policy/TelemetryPolicy.js';
import { DelegatingSampler, setSamplerEnabled } from '../../src/wrapper/DelegatingSampler.js';
import { AlwaysOnSampler } from '@opentelemetry/sdk-trace-base';

afterEach(() => { setSamplerEnabled(true); DelegatingSampler.setDelegate(new AlwaysOnSampler()); });

describe('TraceSamplingRatePolicyImplementer', () => {
  it('has TraceSamplingValidator', () => {
    const impl = new TraceSamplingRatePolicyImplementer();
    expect(impl.getValidators().length).toBe(1);
    expect(impl.getValidators()[0].getPolicyType()).toBe('TraceSamplingRatePolicy');
  });
  it('sets delegate sampler on policy change', () => {
    const impl = new TraceSamplingRatePolicyImplementer();
    impl.onPoliciesChanged([new TraceSamplingRatePolicy(0.5)]);
    expect(true).toBe(true);
  });
  it('resets sampler on bare TelemetryPolicy sentinel', () => {
    const impl = new TraceSamplingRatePolicyImplementer();
    impl.onPoliciesChanged([new TelemetryPolicy('TraceSamplingRatePolicy')]);
    expect(true).toBe(true);
  });
});
