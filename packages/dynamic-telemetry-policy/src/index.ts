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
export { TelemetryPolicy } from './policy/TelemetryPolicy';
export { TraceSamplingRatePolicy } from './policy/TraceSamplingRatePolicy';
export { TraceExportEnabledPolicy } from './policy/TraceExportEnabledPolicy';
export { MetricExportEnabledPolicy } from './policy/MetricExportEnabledPolicy';
export { LogExportEnabledPolicy } from './policy/LogExportEnabledPolicy';
export { OpampPollingIntervalPolicy } from './policy/OpampPollingIntervalPolicy';

// Source
export { SourceFormat, parseSource, parseJsonSource, parseKeyValueSource } from './source/SourceFormat';
export type { SourceWrapper } from './source/SourceWrapper';
export { JsonSourceWrapper } from './source/JsonSourceWrapper';
export { KeyValueSourceWrapper } from './source/KeyValueSourceWrapper';

// Validators
export type { PolicyValidator } from './validator/PolicyValidator';
export { AbstractSourcePolicyValidator } from './validator/AbstractSourcePolicyValidator';
export { TraceSamplingValidator } from './validator/TraceSamplingValidator';
export { TraceExportEnabledValidator } from './validator/TraceExportEnabledValidator';
export { MetricExportEnabledValidator } from './validator/MetricExportEnabledValidator';
export { LogExportEnabledValidator } from './validator/LogExportEnabledValidator';
export { OpampPollingIntervalValidator } from './validator/OpampPollingIntervalValidator';

// Wrappers
export { DelegatingSampler, setSamplerEnabled } from './wrapper/DelegatingSampler';
export { DelegatingSpanExporter, setSpanExporterEnabled } from './wrapper/DelegatingSpanExporter';
export { DelegatingMetricExporter, setMetricExporterEnabled } from './wrapper/DelegatingMetricExporter';
export { DelegatingLogRecordExporter, setLogExporterEnabled } from './wrapper/DelegatingLogRecordExporter';

// Implementers
export type { PolicyImplementer } from './implementer/PolicyImplementer';
export { TraceSamplingRatePolicyImplementer } from './implementer/TraceSamplingRatePolicyImplementer';
export { TraceExportEnabledPolicyImplementer } from './implementer/TraceExportEnabledPolicyImplementer';
export { MetricExportEnabledPolicyImplementer } from './implementer/MetricExportEnabledPolicyImplementer';
export { LogExportEnabledPolicyImplementer } from './implementer/LogExportEnabledPolicyImplementer';
export { OpampPollingIntervalPolicyImplementer } from './implementer/OpampPollingIntervalPolicyImplementer';

// Store
export { PolicyStore } from './store/PolicyStore';

// Providers
export type { PolicyProvider } from './provider/PolicyProvider';
export { LinePerPolicyFileProvider } from './provider/LinePerPolicyFileProvider';
export { OpampPolicyProvider } from './provider/OpampPolicyProvider';

// Config
export type { PolicyInitConfig, PolicySourceConfig, PolicyMappingTypeAndKey } from './config/PolicyInitConfig';
export { PolicyInitConfigReader } from './config/PolicyInitConfigReader';

// Registry
export { PolicyRegistry } from './registry/PolicyRegistry';
