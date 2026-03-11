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

import { MetricExportEnabledPolicy } from '../policy/MetricExportEnabledPolicy';
import type { TelemetryPolicy } from '../policy/TelemetryPolicy';
import { AbstractSourcePolicyValidator } from './AbstractSourcePolicyValidator';

export class MetricExportEnabledValidator extends AbstractSourcePolicyValidator {
  getPolicyType(): string {
    return 'MetricExportEnabledPolicy';
  }

  validateJsonValue(value: unknown): TelemetryPolicy | null {
    if (typeof value !== 'boolean') return null;
    return new MetricExportEnabledPolicy(value);
  }

  validateKeyValueValue(value: string): TelemetryPolicy | null {
    if (value === 'true') return new MetricExportEnabledPolicy(true);
    if (value === 'false') return new MetricExportEnabledPolicy(false);
    return null;
  }
}
