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

import { JsonSourceWrapper } from './JsonSourceWrapper';
import { KeyValueSourceWrapper } from './KeyValueSourceWrapper';
import type { SourceWrapper } from './SourceWrapper';

export enum SourceFormat {
  JSON = 'JSON',
  KEYVALUE = 'KEYVALUE',
}

export function parseJsonSource(text: string): SourceWrapper[] | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }

  if (Array.isArray(parsed)) {
    const wrappers: SourceWrapper[] = [];
    for (const item of parsed) {
      if (typeof item !== 'object' || item === null || Array.isArray(item)) {
        return null;
      }
      const keys = Object.keys(item as object);
      if (keys.length !== 1) {
        return null;
      }
      wrappers.push(new JsonSourceWrapper(item as { [key: string]: unknown }));
    }
    return wrappers;
  }

  if (typeof parsed === 'object' && parsed !== null) {
    const keys = Object.keys(parsed as object);
    if (keys.length !== 1) {
      return null;
    }
    return [new JsonSourceWrapper(parsed as { [key: string]: unknown })];
  }

  return null;
}

export function parseKeyValueSource(text: string): SourceWrapper[] {
  const wrappers: SourceWrapper[] = [];
  const lines = text.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '' || trimmed.startsWith('#')) {
      continue;
    }
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) {
      continue;
    }
    const key = trimmed.substring(0, eqIndex).trim();
    const value = trimmed.substring(eqIndex + 1).trim();
    wrappers.push(new KeyValueSourceWrapper(key, value));
  }
  return wrappers;
}

export function parseSource(format: SourceFormat, text: string): SourceWrapper[] | null {
  if (format === SourceFormat.JSON) {
    return parseJsonSource(text);
  }
  return parseKeyValueSource(text);
}
