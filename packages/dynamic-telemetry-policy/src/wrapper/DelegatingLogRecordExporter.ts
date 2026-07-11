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

import type { LogRecordExporter, ReadableLogRecord } from '@opentelemetry/sdk-logs';
import type { ExportResult } from '@opentelemetry/core';
import { ExportResultCode } from '@opentelemetry/core';

let logEnabled = true;

export function setLogExporterEnabled(value: boolean): void {
  logEnabled = value;
}

export class DelegatingLogRecordExporter implements LogRecordExporter {
  private delegate: LogRecordExporter;

  constructor(delegate: LogRecordExporter) {
    this.delegate = delegate;
  }

  static setEnabled(value: boolean): void {
    setLogExporterEnabled(value);
  }

  export(records: ReadableLogRecord[], resultCallback: (result: ExportResult) => void): void {
    if (!logEnabled) {
      resultCallback({ code: ExportResultCode.SUCCESS });
      return;
    }
    this.delegate.export(records, resultCallback);
  }

  async shutdown(): Promise<void> {
    return this.delegate.shutdown();
  }
}
