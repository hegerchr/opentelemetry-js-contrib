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
import { DelegatingSampler, setSamplerEnabled } from '../../src/wrapper/DelegatingSampler';
import { SamplingDecision, AlwaysOnSampler, AlwaysOffSampler } from '@opentelemetry/sdk-trace-base';
import { ROOT_CONTEXT, SpanKind } from '@opentelemetry/api';

afterEach(() => { setSamplerEnabled(true); DelegatingSampler.setDelegate(new AlwaysOnSampler()); });

describe('DelegatingSampler', () => {
  it('delegates to the initial sampler', () => {
    const sampler = new DelegatingSampler(new AlwaysOnSampler());
    const result = sampler.shouldSample(ROOT_CONTEXT, '1', 'span', SpanKind.CLIENT, {}, []);
    expect(result.decision).toBe(SamplingDecision.RECORD_AND_SAMPLED);
  });
  it('uses the new delegate after setDelegate', () => {
    const sampler = new DelegatingSampler(new AlwaysOnSampler());
    DelegatingSampler.setDelegate(new AlwaysOffSampler());
    const result = sampler.shouldSample(ROOT_CONTEXT, '1', 'span', SpanKind.CLIENT, {}, []);
    expect(result.decision).toBe(SamplingDecision.NOT_RECORD);
  });
  it('returns RECORD_AND_SAMPLED when disabled', () => {
    const sampler = new DelegatingSampler(new AlwaysOffSampler());
    setSamplerEnabled(false);
    const result = sampler.shouldSample(ROOT_CONTEXT, '1', 'span', SpanKind.CLIENT, {}, []);
    expect(result.decision).toBe(SamplingDecision.RECORD_AND_SAMPLED);
  });
});
