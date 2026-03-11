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

import * as fs from 'fs';
import type { PolicyProvider } from './PolicyProvider.js';
import type { PolicyValidator } from '../validator/PolicyValidator.js';
import type { TelemetryPolicy } from '../policy/TelemetryPolicy.js';
import { parseSource, SourceFormat } from '../source/SourceFormat.js';

export class LinePerPolicyFileProvider implements PolicyProvider {
  constructor(
    private readonly filePath: string,
    private readonly validators: Map<string, PolicyValidator>
  ) {}

  fetchPolicies(): TelemetryPolicy[] {
    try {
      const content = fs.readFileSync(this.filePath, 'utf-8');
      return this.parsePolicies(content);
    } catch {
      return [];
    }
  }

  private parsePolicies(content: string): TelemetryPolicy[] {
    const policies: TelemetryPolicy[] = [];
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed === '' || trimmed.startsWith('#')) {
        continue;
      }
      let format: SourceFormat;
      if (trimmed.startsWith('{')) {
        format = SourceFormat.JSON;
      } else if (trimmed.includes('=')) {
        format = SourceFormat.KEYVALUE;
      } else {
        continue;
      }
      const wrappers = parseSource(format, trimmed);
      if (!wrappers) continue;
      for (const wrapper of wrappers) {
        const validator = this.validators.get(wrapper.getPolicyType());
        if (validator) {
          const policy = validator.validate(wrapper);
          if (policy !== null) {
            policies.push(policy);
          }
        }
      }
    }
    return policies;
  }

  startWatching(callback: (policies: TelemetryPolicy[]) => void): () => void {
    let watcher: fs.FSWatcher | null = null;
    try {
      watcher = fs.watch(this.filePath, () => {
        callback(this.fetchPolicies());
      });
    } catch {
      // File may not exist yet; return no-op stop function
    }
    return () => {
      watcher?.close();
    };
  }
}
