import { Result } from "../../../../lib/core/Result";
import { ValueObject } from "../../../../lib/domain/ValueObject";
import { getPredictionValidator } from "../predictionValidators";
import { PlayerPrediction } from "../types";
import { MatchQuestions } from "./matchQuestions";

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

    public static create(
        predictions: PlayerPrediction[],
        skipValidation: boolean,
        matchQuestions?: MatchQuestions
    ): Result<PlayerPredictions> {
        // check each question and confirm they have an appropriate answer
        if (skipValidation)
            return Result.ok<PlayerPredictions>(
                new PlayerPredictions({ value: predictions })
            );

        let valid = false;
        let currentCode = "";
        const questions = matchQuestions?.value;
        if (!questions || !questions.length)
            return Result.fail<PlayerPredictions>("Match questions required");

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

                valid = !!options.find((o) => o.value === prediction.value);
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
