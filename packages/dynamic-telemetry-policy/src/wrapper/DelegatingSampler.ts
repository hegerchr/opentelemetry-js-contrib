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

import type { Sampler, SamplingResult, Context, Attributes, Link, SpanKind } from '@opentelemetry/api';
import { SamplingDecision } from '@opentelemetry/sdk-trace-base';

let samplerEnabled = true;
let samplerDelegate: Sampler | null = null;

export function setSamplerEnabled(value: boolean): void {
  samplerEnabled = value;
}

export class DelegatingSampler implements Sampler {
  constructor(initialDelegate: Sampler) {
    samplerDelegate = initialDelegate;
  }

  static setEnabled(value: boolean): void {
    setSamplerEnabled(value);
  }

  static setDelegate(sampler: Sampler): void {
    samplerDelegate = sampler;
  }

  shouldSample(
    context: Context,
    traceId: string,
    spanName: string,
    spanKind: SpanKind,
    attributes: Attributes,
    links: Link[]
  ): SamplingResult {
    if (!samplerEnabled || samplerDelegate === null) {
      return { decision: SamplingDecision.RECORD_AND_SAMPLED };
    }
    return samplerDelegate.shouldSample(context, traceId, spanName, spanKind, attributes, links);
  }

  toString(): string {
    return `DelegatingSampler(${samplerDelegate?.toString() ?? 'null'})`;
  }
}
