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
import { TraceSamplingRatePolicy } from '../../src/policy/TraceSamplingRatePolicy.js';

describe('TraceSamplingRatePolicy', () => {
  it('creates with valid probability', () => {
    const p = new TraceSamplingRatePolicy(0.5);
    expect(p.probability).toBe(0.5);
    expect(p.type).toBe('TraceSamplingRatePolicy');
  });

  it('allows 0 and 1', () => {
    expect(() => new TraceSamplingRatePolicy(0)).not.toThrow();
    expect(() => new TraceSamplingRatePolicy(1)).not.toThrow();
  });

  it('throws for negative probability', () => {
    expect(() => new TraceSamplingRatePolicy(-0.1)).toThrow();
  });

  it('throws for probability > 1', () => {
    expect(() => new TraceSamplingRatePolicy(1.1)).toThrow();
  });

  it('throws for NaN', () => {
    expect(() => new TraceSamplingRatePolicy(NaN)).toThrow();
  });

  it('equals same probability', () => {
    const p1 = new TraceSamplingRatePolicy(0.5);
    const p2 = new TraceSamplingRatePolicy(0.5);
    expect(p1.equals(p2)).toBe(true);
  });

  it('does not equal different probability', () => {
    const p1 = new TraceSamplingRatePolicy(0.5);
    const p2 = new TraceSamplingRatePolicy(0.7);
    expect(p1.equals(p2)).toBe(false);
  });
});
