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
import { JsonSourceWrapper } from '../../src/source/JsonSourceWrapper.js';
import { SourceFormat } from '../../src/source/SourceFormat.js';

describe('JsonSourceWrapper', () => {
  it('creates from single-key object', () => {
    const w = new JsonSourceWrapper({ TraceSamplingRatePolicy: 0.5 });
    expect(w.getPolicyType()).toBe('TraceSamplingRatePolicy');
    expect(w.getValue()).toBe(0.5);
    expect(w.getFormat()).toBe(SourceFormat.JSON);
  });

  it('throws for multi-key object', () => {
    expect(() => new JsonSourceWrapper({ a: 1, b: 2 } as Record<string, unknown>)).toThrow();
  });
});
