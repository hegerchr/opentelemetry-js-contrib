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

import { SourceFormat } from '../source/SourceFormat';
import type { SourceWrapper } from '../source/SourceWrapper';
import type { TelemetryPolicy } from '../policy/TelemetryPolicy';
import type { PolicyValidator } from './PolicyValidator';

export abstract class AbstractSourcePolicyValidator implements PolicyValidator {
  abstract getPolicyType(): string;
  abstract validateJsonValue(value: unknown): TelemetryPolicy | null;
  abstract validateKeyValueValue(value: string): TelemetryPolicy | null;

  validate(source: SourceWrapper): TelemetryPolicy | null {
    try {
      if (source.getFormat() === SourceFormat.JSON) {
        if (source.getPolicyType() !== this.getPolicyType()) {
          return null;
        }
        return this.validateJsonValue(source.getValue());
      } else {
        if (source.getPolicyType() !== this.getPolicyType()) {
          return null;
        }
        return this.validateKeyValueValue(source.getValue() as string);
      }
    } catch {
      return null;
    }
  }
}
