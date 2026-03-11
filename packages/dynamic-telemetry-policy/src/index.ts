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

// Policy types
export { TelemetryPolicy } from './policy/TelemetryPolicy.js';
export { TraceSamplingRatePolicy } from './policy/TraceSamplingRatePolicy.js';
export { TraceExportEnabledPolicy } from './policy/TraceExportEnabledPolicy.js';
export { MetricExportEnabledPolicy } from './policy/MetricExportEnabledPolicy.js';
export { LogExportEnabledPolicy } from './policy/LogExportEnabledPolicy.js';
export { OpampPollingIntervalPolicy } from './policy/OpampPollingIntervalPolicy.js';

// Source
export { SourceFormat, parseSource, parseJsonSource, parseKeyValueSource } from './source/SourceFormat.js';
export type { SourceWrapper } from './source/SourceWrapper.js';
export { JsonSourceWrapper } from './source/JsonSourceWrapper.js';
export { KeyValueSourceWrapper } from './source/KeyValueSourceWrapper.js';

// Validators
export type { PolicyValidator } from './validator/PolicyValidator.js';
export { AbstractSourcePolicyValidator } from './validator/AbstractSourcePolicyValidator.js';
export { TraceSamplingValidator } from './validator/TraceSamplingValidator.js';
export { TraceExportEnabledValidator } from './validator/TraceExportEnabledValidator.js';
export { MetricExportEnabledValidator } from './validator/MetricExportEnabledValidator.js';
export { LogExportEnabledValidator } from './validator/LogExportEnabledValidator.js';
export { OpampPollingIntervalValidator } from './validator/OpampPollingIntervalValidator.js';

// Wrappers
export { DelegatingSampler, setSamplerEnabled } from './wrapper/DelegatingSampler.js';
export { DelegatingSpanExporter, setSpanExporterEnabled } from './wrapper/DelegatingSpanExporter.js';
export { DelegatingMetricExporter, setMetricExporterEnabled } from './wrapper/DelegatingMetricExporter.js';
export { DelegatingLogRecordExporter, setLogExporterEnabled } from './wrapper/DelegatingLogRecordExporter.js';

// Implementers
export type { PolicyImplementer } from './implementer/PolicyImplementer.js';
export { TraceSamplingRatePolicyImplementer } from './implementer/TraceSamplingRatePolicyImplementer.js';
export { TraceExportEnabledPolicyImplementer } from './implementer/TraceExportEnabledPolicyImplementer.js';
export { MetricExportEnabledPolicyImplementer } from './implementer/MetricExportEnabledPolicyImplementer.js';
export { LogExportEnabledPolicyImplementer } from './implementer/LogExportEnabledPolicyImplementer.js';
export { OpampPollingIntervalPolicyImplementer } from './implementer/OpampPollingIntervalPolicyImplementer.js';

// Store
export { PolicyStore } from './store/PolicyStore.js';

// Providers
export type { PolicyProvider } from './provider/PolicyProvider.js';
export { LinePerPolicyFileProvider } from './provider/LinePerPolicyFileProvider.js';
export { OpampPolicyProvider } from './provider/OpampPolicyProvider.js';

// Config
export type { PolicyInitConfig, PolicySourceConfig, PolicyMappingTypeAndKey } from './config/PolicyInitConfig.js';
export { PolicyInitConfigReader } from './config/PolicyInitConfigReader.js';

// Registry
export { PolicyRegistry } from './registry/PolicyRegistry.js';
