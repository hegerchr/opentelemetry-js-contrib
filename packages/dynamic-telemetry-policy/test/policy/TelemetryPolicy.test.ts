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
import { TelemetryPolicy } from '../../src/policy/TelemetryPolicy.js';
import { TraceSamplingRatePolicy } from '../../src/policy/TraceSamplingRatePolicy.js';

describe('TelemetryPolicy', () => {
  it('stores the type', () => {
    const p = new TelemetryPolicy('test');
    expect(p.type).toBe('test');
  });

  it('equals same instance', () => {
    const p = new TelemetryPolicy('test');
    expect(p.equals(p)).toBe(true);
  });

  it('equals different instance with same type', () => {
    const p1 = new TelemetryPolicy('test');
    const p2 = new TelemetryPolicy('test');
    expect(p1.equals(p2)).toBe(true);
  });

  it('does not equal different type', () => {
    const p1 = new TelemetryPolicy('a');
    const p2 = new TelemetryPolicy('b');
    expect(p1.equals(p2)).toBe(false);
  });

  it('does not equal subclass with same type string', () => {
    const base = new TelemetryPolicy('TraceSamplingRatePolicy');
    const sub = new TraceSamplingRatePolicy(0.5);
    expect(base.equals(sub)).toBe(false);
  });
});
