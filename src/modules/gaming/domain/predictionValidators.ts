import { isValidNumber } from "../../../lib/utils/typeUtils";
import { FootballQuestion, MatchQuestionCode } from "./types";

export type PredictionValidator = (answer: any) => boolean;

const finalScoreValidator: PredictionValidator = (answer) => {
    return (
        answer.home &&
        answer.away &&
        isValidNumber(answer.home) &&
        isValidNumber(answer.away)
    );
};

const noOfGoalsValidator: PredictionValidator = (answer) => {
    return answer && isValidNumber(answer);
};

export const getPredictionValidator = (
    code: MatchQuestionCode
): PredictionValidator => {
    switch (code) {
        case FootballQuestion.FinalScore:
            return finalScoreValidator;
        case FootballQuestion.NoOfGoals:
            return noOfGoalsValidator;
        default:
            throw new Error(`${code} question has no validator`);
    }
};
