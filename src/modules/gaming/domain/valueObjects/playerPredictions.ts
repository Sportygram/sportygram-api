import { isEqual } from "lodash";
import { Result } from "../../../../lib/core/Result";
import { ValueObject } from "../../../../lib/domain/ValueObject";
import { Match } from "../match";
import { getPredictionValidator } from "../predictionValidators";
import { MatchQuestionsMap, PlayerPrediction } from "../types";

export interface PlayerPredictionsProps {
    value: PlayerPrediction[];
}

export class PlayerPredictions extends ValueObject<PlayerPredictionsProps> {
    get value(): PlayerPrediction[] {
        return this.props.value;
    }

    private constructor(props: PlayerPredictionsProps) {
        super(props);
    }

    public updatePredictions(_newPredictions: PlayerPredictions): Result<void> {
        return Result.ok();
    }

    public scoreUnscoredPredictions(match: Match): Result<number> {
        const questions = match.questions.value;
        let score = 0;

        for (let prediction of this.value) {
            if (prediction.scored) continue;

            const { code, value } = prediction;
            const question = questions.find((q) => q.code === code);
            if (!question) continue;

            const { solution } = question;
            if (!solution) continue;
            const { correctPoints } = MatchQuestionsMap[code];

            if (isEqual(solution, value)) {
                prediction.points = correctPoints || 0;
                prediction.scored = true;
                score += prediction.points;
            } else {
                prediction.points = 0;
                prediction.scored = true;
            }
        }

        return Result.ok(score);
    }

    public static create(
        predictions: PlayerPrediction[],
        validate = true,
        match?: Match
    ): Result<PlayerPredictions> {
        // check each question and confirm they have an appropriate answer
        if (!validate)
            return Result.ok<PlayerPredictions>(
                new PlayerPredictions({ value: predictions })
            );

        let valid = false;
        let currentCode = "";
        if (!match)
            return Result.fail<PlayerPredictions>("Match teams required");

        const questionsOrError = match.getQuestionsWithOptions();
        if (questionsOrError.isFailure && questionsOrError.error)
            return Result.fail<PlayerPredictions>(
                questionsOrError.error.toString()
            );

        const questions = questionsOrError.getValue();

        for (let question of questions) {
            const { code, type, options } = question;
            currentCode = code;
            const prediction = predictions.find((p) => p.code === code);

            if (!prediction)
                return Result.fail<PlayerPredictions>(
                    `${code} question prediction missing`
                );
            if (type === "select") {
                if (!options)
                return Result.fail<PlayerPredictions>(
                        `${code} question options missing`
                    );

                valid = !!options.find(
                    (o) =>
                        o.value.toLowerCase() ===
                        `${prediction.value}`.toLowerCase()
                );
                if (!valid) break;
            } else {
                // get validator with code and validate
                const validator = getPredictionValidator(code);
                valid = validator(prediction.value);
                if (!valid) break;
            }
        }

        if (!valid)
            return Result.fail<PlayerPredictions>(
                `Invalid answer for ${currentCode} question`
            );

        return Result.ok<PlayerPredictions>(
            new PlayerPredictions({ value: predictions })
        );
    }
}
