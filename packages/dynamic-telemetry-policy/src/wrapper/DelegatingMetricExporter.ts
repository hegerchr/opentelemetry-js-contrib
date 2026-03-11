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

import type { PushMetricExporter, ResourceMetrics } from '@opentelemetry/sdk-metrics';
import type { ExportResult } from '@opentelemetry/core';
import { ExportResultCode } from '@opentelemetry/core';

let metricEnabled = true;

export function setMetricExporterEnabled(value: boolean): void {
  metricEnabled = value;
}

export class DelegatingMetricExporter implements PushMetricExporter {
  private delegate: PushMetricExporter;

  constructor(delegate: PushMetricExporter) {
    this.delegate = delegate;
  }

  static setEnabled(value: boolean): void {
    setMetricExporterEnabled(value);
  }

  export(metrics: ResourceMetrics, resultCallback: (result: ExportResult) => void): void {
    if (!metricEnabled) {
      resultCallback({ code: ExportResultCode.SUCCESS });
      return;
    }
    this.delegate.export(metrics, resultCallback);
  }

  async forceFlush(): Promise<void> {
    return this.delegate.forceFlush();
  }

  async shutdown(): Promise<void> {
    return this.delegate.shutdown();
  }
}
