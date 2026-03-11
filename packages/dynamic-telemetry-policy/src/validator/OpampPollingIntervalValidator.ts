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

import { OpampPollingIntervalPolicy } from '../policy/OpampPollingIntervalPolicy.js';
import type { TelemetryPolicy } from '../policy/TelemetryPolicy.js';
import { AbstractSourcePolicyValidator } from './AbstractSourcePolicyValidator.js';

export class OpampPollingIntervalValidator extends AbstractSourcePolicyValidator {
  getPolicyType(): string {
    return 'OpampPollingIntervalPolicy';
  }

  validateJsonValue(value: unknown): TelemetryPolicy | null {
    if (typeof value !== 'number') return null;
    const ms = value * 1000;
    try {
      return new OpampPollingIntervalPolicy(ms);
    } catch {
      return null;
    }
  }

  validateKeyValueValue(value: string): TelemetryPolicy | null {
    const seconds = parseInt(value, 10);
    if (isNaN(seconds)) return null;
    const ms = seconds * 1000;
    try {
      return new OpampPollingIntervalPolicy(ms);
    } catch {
      return null;
    }
  }
}
