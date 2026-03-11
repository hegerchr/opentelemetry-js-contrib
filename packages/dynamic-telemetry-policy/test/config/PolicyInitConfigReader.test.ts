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
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { PolicyInitConfigReader } from '../../src/config/PolicyInitConfigReader.js';

describe('PolicyInitConfigReader', () => {
  let tmpDir: string;
  beforeEach(() => { tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'policy-test-')); });
  afterEach(() => { fs.rmSync(tmpDir, { recursive: true }); });

  it('reads a valid config file', () => {
    const config = { sources: [{ kind: 'file', format: 'keyvalue', location: '/some/path/policies.conf', mappings: [{ sourceKey: 'TraceSamplingRatePolicy', policyType: 'TraceSamplingRatePolicy' }] }] };
    const configPath = path.join(tmpDir, 'policy-init.json');
    fs.writeFileSync(configPath, JSON.stringify(config));
    const reader = new PolicyInitConfigReader();
    const result = reader.read(configPath);
    expect(result.sources.length).toBe(1);
    expect(result.sources[0].location).toBe('/some/path/policies.conf');
  });
  it('resolves DEFAULT location for file source', () => {
    const config = { sources: [{ kind: 'file', format: 'keyvalue', location: 'DEFAULT', mappings: [] }] };
    const configPath = path.join(tmpDir, 'policy-init.json');
    fs.writeFileSync(configPath, JSON.stringify(config));
    const reader = new PolicyInitConfigReader();
    const result = reader.read(configPath);
    expect(result.sources[0].location).toBe(path.join(tmpDir, 'policies.conf'));
  });
});
