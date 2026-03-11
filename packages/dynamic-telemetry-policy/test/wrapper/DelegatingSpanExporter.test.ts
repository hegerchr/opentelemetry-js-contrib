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
import { expect } from 'expect';
import { DelegatingSpanExporter, setSpanExporterEnabled } from '../../src/wrapper/DelegatingSpanExporter.js';
import { ExportResultCode } from '@opentelemetry/core';
import type { ExportResult } from '@opentelemetry/core';
import type { ReadableSpan, SpanExporter } from '@opentelemetry/sdk-trace-base';

afterEach(() => { setSpanExporterEnabled(true); });

describe('DelegatingSpanExporter', () => {
  it('delegates export when enabled', (done) => {
    let delegateCalled = false;
    const mockDelegate: SpanExporter = {
      export: (_spans: ReadableSpan[], cb: (result: ExportResult) => void) => { delegateCalled = true; cb({ code: ExportResultCode.SUCCESS }); },
      shutdown: async () => {},
    };
    setSpanExporterEnabled(true);
    const exporter = new DelegatingSpanExporter(mockDelegate);
    exporter.export([], (result: ExportResult) => { expect(delegateCalled).toBe(true); expect(result.code).toBe(ExportResultCode.SUCCESS); done(); });
  });
  it('skips export when disabled', (done) => {
    let delegateCalled = false;
    const mockDelegate: SpanExporter = {
      export: (_spans: ReadableSpan[], cb: (result: ExportResult) => void) => { delegateCalled = true; cb({ code: ExportResultCode.SUCCESS }); },
      shutdown: async () => {},
    };
    setSpanExporterEnabled(false);
    const exporter = new DelegatingSpanExporter(mockDelegate);
    exporter.export([], (result: ExportResult) => { expect(delegateCalled).toBe(false); expect(result.code).toBe(ExportResultCode.SUCCESS); done(); });
  });
  it('delegates shutdown', async () => {
    let shutdownCalled = false;
    const mockDelegate: SpanExporter = {
      export: (_spans: ReadableSpan[], cb: (result: ExportResult) => void) => cb({ code: ExportResultCode.SUCCESS }),
      shutdown: async () => { shutdownCalled = true; },
    };
    const exporter = new DelegatingSpanExporter(mockDelegate);
    await exporter.shutdown();
    expect(shutdownCalled).toBe(true);
  });
});
