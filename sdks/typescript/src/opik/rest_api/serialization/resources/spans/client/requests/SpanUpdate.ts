/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../index";
import * as OpikApi from "../../../../../api/index";
import * as core from "../../../../../core";
import { JsonNode } from "../../../../types/JsonNode";
import { ErrorInfo } from "../../../../types/ErrorInfo";

export const SpanUpdate: core.serialization.Schema<serializers.SpanUpdate.Raw, OpikApi.SpanUpdate> =
    core.serialization.object({
        projectName: core.serialization.property("project_name", core.serialization.string().optional()),
        projectId: core.serialization.property("project_id", core.serialization.string().optional()),
        traceId: core.serialization.property("trace_id", core.serialization.string()),
        parentSpanId: core.serialization.property("parent_span_id", core.serialization.string().optional()),
        endTime: core.serialization.property("end_time", core.serialization.date().optional()),
        input: JsonNode.optional(),
        output: JsonNode.optional(),
        metadata: JsonNode.optional(),
        model: core.serialization.string().optional(),
        provider: core.serialization.string().optional(),
        tags: core.serialization.list(core.serialization.string()).optional(),
        usage: core.serialization.record(core.serialization.string(), core.serialization.number()).optional(),
        totalEstimatedCost: core.serialization.property("total_estimated_cost", core.serialization.number().optional()),
        errorInfo: core.serialization.property("error_info", ErrorInfo.optional()),
    });

export declare namespace SpanUpdate {
    interface Raw {
        project_name?: string | null;
        project_id?: string | null;
        trace_id: string;
        parent_span_id?: string | null;
        end_time?: string | null;
        input?: JsonNode.Raw | null;
        output?: JsonNode.Raw | null;
        metadata?: JsonNode.Raw | null;
        model?: string | null;
        provider?: string | null;
        tags?: string[] | null;
        usage?: Record<string, number> | null;
        total_estimated_cost?: number | null;
        error_info?: ErrorInfo.Raw | null;
    }
}
