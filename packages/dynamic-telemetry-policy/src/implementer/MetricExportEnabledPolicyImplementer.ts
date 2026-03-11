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

import { TelemetryPolicy } from '../policy/TelemetryPolicy.js';
import { MetricExportEnabledPolicy } from '../policy/MetricExportEnabledPolicy.js';
import { MetricExportEnabledValidator } from '../validator/MetricExportEnabledValidator.js';
import type { PolicyValidator } from '../validator/PolicyValidator.js';
import { DelegatingMetricExporter } from '../wrapper/DelegatingMetricExporter.js';
import type { PolicyImplementer } from './PolicyImplementer.js';

export class MetricExportEnabledPolicyImplementer implements PolicyImplementer {
  getValidators(): PolicyValidator[] {
    return [new MetricExportEnabledValidator()];
  }

  onPoliciesChanged(policies: TelemetryPolicy[]): void {
    for (const policy of policies) {
      if (policy instanceof MetricExportEnabledPolicy) {
        DelegatingMetricExporter.setEnabled(policy.enabled);
      } else if (policy.constructor === TelemetryPolicy) {
        DelegatingMetricExporter.setEnabled(true);
      }
    }
  }
}
