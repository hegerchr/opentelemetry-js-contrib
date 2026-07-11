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

import type { SpanExporter, ReadableSpan } from '@opentelemetry/sdk-trace-base';
import type { ExportResult } from '@opentelemetry/core';
import { ExportResultCode } from '@opentelemetry/core';

let enabled = true;

export function setSpanExporterEnabled(value: boolean): void {
  enabled = value;
}

export class DelegatingSpanExporter implements SpanExporter {
  private delegate: SpanExporter;

  constructor(delegate: SpanExporter) {
    this.delegate = delegate;
  }

  static setEnabled(value: boolean): void {
    setSpanExporterEnabled(value);
  }

  export(spans: ReadableSpan[], resultCallback: (result: ExportResult) => void): void {
    if (!enabled) {
      resultCallback({ code: ExportResultCode.SUCCESS });
      return;
    }
    this.delegate.export(spans, resultCallback);
  }

  shutdown(): Promise<void> {
    return this.delegate.shutdown();
  }
}
