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
import { KeyValueSourceWrapper } from '../../src/source/KeyValueSourceWrapper';
import { SourceFormat } from '../../src/source/SourceFormat';

describe('KeyValueSourceWrapper', () => {
  it('returns format KEYVALUE', () => {
    const w = new KeyValueSourceWrapper('TraceSamplingRatePolicy', '0.5');
    expect(w.getFormat()).toBe(SourceFormat.KEYVALUE);
  });

  it('returns policy type and value', () => {
    const w = new KeyValueSourceWrapper('MyPolicy', 'someValue');
    expect(w.getPolicyType()).toBe('MyPolicy');
    expect(w.getValue()).toBe('someValue');
  });
});
