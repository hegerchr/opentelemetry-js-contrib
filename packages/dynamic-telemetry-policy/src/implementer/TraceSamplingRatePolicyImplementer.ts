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

import { AlwaysOnSampler, ParentBasedSampler, TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-base';
import { TelemetryPolicy } from '../policy/TelemetryPolicy';
import { TraceSamplingRatePolicy } from '../policy/TraceSamplingRatePolicy';
import { TraceSamplingValidator } from '../validator/TraceSamplingValidator';
import type { PolicyValidator } from '../validator/PolicyValidator';
import { DelegatingSampler } from '../wrapper/DelegatingSampler';
import type { PolicyImplementer } from './PolicyImplementer';

export class TraceSamplingRatePolicyImplementer implements PolicyImplementer {
  getValidators(): PolicyValidator[] {
    return [new TraceSamplingValidator()];
  }

  onPoliciesChanged(policies: TelemetryPolicy[]): void {
    for (const policy of policies) {
      if (policy instanceof TraceSamplingRatePolicy) {
        DelegatingSampler.setDelegate(
          new ParentBasedSampler({
            root: new TraceIdRatioBasedSampler(policy.probability),
          })
        );
      } else if (policy.constructor === TelemetryPolicy) {
        DelegatingSampler.setDelegate(new AlwaysOnSampler());
      }
    }
  }
}
