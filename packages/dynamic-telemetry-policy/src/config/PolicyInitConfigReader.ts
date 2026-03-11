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
import * as path from 'path';
import type { PolicyInitConfig, PolicySourceConfig } from './PolicyInitConfig.js';

export class PolicyInitConfigReader {
  read(filePath: string): PolicyInitConfig {
    const content = fs.readFileSync(filePath, 'utf-8');
    const config = JSON.parse(content) as PolicyInitConfig;

    const dir = path.dirname(filePath);
    for (const source of config.sources) {
      if (source.location === 'DEFAULT') {
        source.location = this.resolveDefault(source, dir);
      }
    }

    return config;
  }

  private resolveDefault(source: PolicySourceConfig, configDir: string): string {
    switch (source.kind) {
      case 'file':
        return path.join(configDir, 'policies.conf');
      case 'opamp':
        return '';
      case 'http':
        return 'http://localhost:80';
      default:
        return '';
    }
  }
}
