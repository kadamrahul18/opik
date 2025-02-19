package com.comet.opik.api;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonView;
import dev.langchain4j.data.message.ChatMessageType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.beans.ConstructorProperties;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder(toBuilder = true)
@ToString(callSuper = true)
public final class AutomationRuleEvaluatorLlmAsJudge
        extends
            AutomationRuleEvaluator<AutomationRuleEvaluatorLlmAsJudge.LlmAsJudgeCode> {

    @NotNull @JsonView({View.Public.class, View.Write.class})
    @Schema(accessMode = Schema.AccessMode.READ_WRITE)
    private LlmAsJudgeCode code;

    @Builder(toBuilder = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record LlmAsJudgeCode(
            @JsonView( {
                    View.Public.class, View.Write.class}) @NotNull LlmAsJudgeModelParameters model,
            @JsonView({View.Public.class, View.Write.class}) @NotNull List<LlmAsJudgeMessage> messages,
            @JsonView({View.Public.class, View.Write.class}) @NotNull Map<String, String> variables,
            @JsonView({View.Public.class, View.Write.class}) @NotNull List<LlmAsJudgeOutputSchema> schema){
    }

    @Builder(toBuilder = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record LlmAsJudgeMessage(
            @JsonView( {
                    View.Public.class, View.Write.class}) @NotNull ChatMessageType role,
            @JsonView({View.Public.class, View.Write.class}) @NotNull String content){
    }

    @Builder(toBuilder = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record LlmAsJudgeOutputSchema(
            @JsonView( {
                    View.Public.class, View.Write.class}) @NotNull String name,
            @JsonView({View.Public.class, View.Write.class}) @NotNull LlmAsJudgeOutputSchemaType type,
            @JsonView({View.Public.class, View.Write.class}) @NotNull String description){
    }

    @Builder(toBuilder = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record LlmAsJudgeModelParameters(
            @JsonView( {
                    View.Public.class, View.Write.class}) @NotNull String name,
            @JsonView({View.Public.class, View.Write.class}) @NotNull Double temperature){
    }

    @ConstructorProperties({"id", "projectId", "name", "samplingRate", "code", "createdAt", "createdBy",
            "lastUpdatedAt", "lastUpdatedBy"})
    public AutomationRuleEvaluatorLlmAsJudge(UUID id, UUID projectId, @NotBlank String name, Float samplingRate,
            @NotNull LlmAsJudgeCode code,
            Instant createdAt, String createdBy, Instant lastUpdatedAt, String lastUpdatedBy) {
        super(id, projectId, name, samplingRate, createdAt, createdBy, lastUpdatedAt, lastUpdatedBy);
        this.code = code;
    }

    @Override
    public AutomationRuleEvaluatorType type() {
        return AutomationRuleEvaluatorType.LLM_AS_JUDGE;
    }
}
