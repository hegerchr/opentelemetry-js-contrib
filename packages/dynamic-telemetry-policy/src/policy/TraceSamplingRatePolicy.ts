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

import { TelemetryPolicy } from './TelemetryPolicy.js';

export class TraceSamplingRatePolicy extends TelemetryPolicy {
  constructor(public readonly probability: number) {
    super('TraceSamplingRatePolicy');
    if (isNaN(probability) || probability < 0 || probability > 1) {
      throw new Error(`Invalid probability: ${probability}. Must be between 0.0 and 1.0.`);
    }
  }

  override equals(other: TelemetryPolicy): boolean {
    return super.equals(other) && (other as TraceSamplingRatePolicy).probability === this.probability;
  }
}
