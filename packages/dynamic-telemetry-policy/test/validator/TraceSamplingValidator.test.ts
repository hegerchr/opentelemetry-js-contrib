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
import { TraceSamplingValidator } from '../../src/validator/TraceSamplingValidator';
import { JsonSourceWrapper } from '../../src/source/JsonSourceWrapper';
import { KeyValueSourceWrapper } from '../../src/source/KeyValueSourceWrapper';
import { TraceSamplingRatePolicy } from '../../src/policy/TraceSamplingRatePolicy';

describe('TraceSamplingValidator', () => {
  const validator = new TraceSamplingValidator();

  it('validates JSON number', () => {
    const wrapper = new JsonSourceWrapper({ TraceSamplingRatePolicy: 0.5 });
    const policy = validator.validate(wrapper);
    expect(policy).toBeInstanceOf(TraceSamplingRatePolicy);
    expect((policy as TraceSamplingRatePolicy).probability).toBe(0.5);
  });

  it('returns null for wrong JSON type', () => {
    const wrapper = new JsonSourceWrapper({ TraceSamplingRatePolicy: 'notanumber' });
    expect(validator.validate(wrapper)).toBeNull();
  });

  it('validates keyvalue string', () => {
    const wrapper = new KeyValueSourceWrapper('TraceSamplingRatePolicy', '0.75');
    const policy = validator.validate(wrapper);
    expect(policy).toBeInstanceOf(TraceSamplingRatePolicy);
    expect((policy as TraceSamplingRatePolicy).probability).toBe(0.75);
  });

  it('returns null for wrong policy type', () => {
    const wrapper = new JsonSourceWrapper({ WrongPolicyType: 0.5 });
    expect(validator.validate(wrapper)).toBeNull();
  });

  it('returns null for out of range value', () => {
    const wrapper = new JsonSourceWrapper({ TraceSamplingRatePolicy: 1.5 });
    expect(validator.validate(wrapper)).toBeNull();
  });

  it('returns null for non-numeric keyvalue', () => {
    const wrapper = new KeyValueSourceWrapper('TraceSamplingRatePolicy', 'notanumber');
    expect(validator.validate(wrapper)).toBeNull();
  });
});
