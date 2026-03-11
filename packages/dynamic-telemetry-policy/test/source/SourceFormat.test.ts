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
import { parseJsonSource, parseKeyValueSource, parseSource, SourceFormat } from '../../src/source/SourceFormat.js';

describe('parseJsonSource', () => {
  it('parses single-key JSON object', () => {
    const wrappers = parseJsonSource('{"TraceSamplingRatePolicy": 0.5}');
    expect(wrappers).not.toBeNull();
    expect(wrappers!.length).toBe(1);
    expect(wrappers![0].getPolicyType()).toBe('TraceSamplingRatePolicy');
    expect(wrappers![0].getValue()).toBe(0.5);
  });

  it('parses array of single-key objects', () => {
    const wrappers = parseJsonSource('[{"A": 1}, {"B": 2}]');
    expect(wrappers).not.toBeNull();
    expect(wrappers!.length).toBe(2);
  });

  it('returns null for invalid JSON', () => {
    expect(parseJsonSource('not json')).toBeNull();
  });

  it('returns null for multi-key object', () => {
    expect(parseJsonSource('{"a": 1, "b": 2}')).toBeNull();
  });
});

describe('parseKeyValueSource', () => {
  it('parses key=value lines', () => {
    const wrappers = parseKeyValueSource('TraceSamplingRatePolicy=0.5\nTraceExportEnabledPolicy=true');
    expect(wrappers.length).toBe(2);
    expect(wrappers[0].getPolicyType()).toBe('TraceSamplingRatePolicy');
    expect(wrappers[0].getValue()).toBe('0.5');
  });

  it('skips comments and blank lines', () => {
    const wrappers = parseKeyValueSource('# comment\n\nKey=value');
    expect(wrappers.length).toBe(1);
    expect(wrappers[0].getPolicyType()).toBe('Key');
  });

  it('skips lines without =', () => {
    const wrappers = parseKeyValueSource('noequalssign');
    expect(wrappers.length).toBe(0);
  });
});

describe('parseSource', () => {
  it('dispatches to JSON parser', () => {
    const wrappers = parseSource(SourceFormat.JSON, '{"A": 1}');
    expect(wrappers).not.toBeNull();
  });

  it('dispatches to KV parser', () => {
    const wrappers = parseSource(SourceFormat.KEYVALUE, 'A=1');
    expect(wrappers).not.toBeNull();
    expect(wrappers!.length).toBe(1);
  });
});
