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
import { OpampPollingIntervalValidator } from '../../src/validator/OpampPollingIntervalValidator';
import { JsonSourceWrapper } from '../../src/source/JsonSourceWrapper';
import { KeyValueSourceWrapper } from '../../src/source/KeyValueSourceWrapper';
import { OpampPollingIntervalPolicy } from '../../src/policy/OpampPollingIntervalPolicy';

describe('OpampPollingIntervalValidator', () => {
  const validator = new OpampPollingIntervalValidator();
  it('validates JSON number (seconds)', () => {
    const wrapper = new JsonSourceWrapper({ OpampPollingIntervalPolicy: 30 });
    const policy = validator.validate(wrapper);
    expect(policy).toBeInstanceOf(OpampPollingIntervalPolicy);
    expect((policy as OpampPollingIntervalPolicy).intervalMs).toBe(30000);
  });
  it('validates keyvalue string (seconds)', () => {
    const wrapper = new KeyValueSourceWrapper('OpampPollingIntervalPolicy', '60');
    const policy = validator.validate(wrapper);
    expect(policy).toBeInstanceOf(OpampPollingIntervalPolicy);
    expect((policy as OpampPollingIntervalPolicy).intervalMs).toBe(60000);
  });
  it('returns null for zero seconds', () => {
    const wrapper = new JsonSourceWrapper({ OpampPollingIntervalPolicy: 0 });
    expect(validator.validate(wrapper)).toBeNull();
  });
  it('returns null for non-numeric', () => {
    const wrapper = new KeyValueSourceWrapper('OpampPollingIntervalPolicy', 'abc');
    expect(validator.validate(wrapper)).toBeNull();
  });
});
