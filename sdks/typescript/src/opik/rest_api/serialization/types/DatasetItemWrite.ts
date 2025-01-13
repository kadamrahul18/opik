/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as OpikApi from "../../api/index";
import * as core from "../../core";
import { DatasetItemWriteSource } from "./DatasetItemWriteSource";
import { JsonNode } from "./JsonNode";

export const DatasetItemWrite: core.serialization.ObjectSchema<
    serializers.DatasetItemWrite.Raw,
    OpikApi.DatasetItemWrite
> = core.serialization.object({
    id: core.serialization.string().optional(),
    traceId: core.serialization.property("trace_id", core.serialization.string().optional()),
    spanId: core.serialization.property("span_id", core.serialization.string().optional()),
    source: DatasetItemWriteSource,
    data: JsonNode,
});

export declare namespace DatasetItemWrite {
    interface Raw {
        id?: string | null;
        trace_id?: string | null;
        span_id?: string | null;
        source: DatasetItemWriteSource.Raw;
        data: JsonNode.Raw;
    }
}
