import { Result } from "../../../../lib/core/Result";
import { ValueObject } from "../../../../lib/domain/ValueObject";
import { FootballQuestion, MatchQuestion, MatchQuestionCode } from "../types";

export interface MatchQuestionsProps {
    value: MatchQuestion[];
}

export class MatchQuestions extends ValueObject<MatchQuestionsProps> {
    get value(): MatchQuestion[] {
        return this.props.value;
    }

    private constructor(props: MatchQuestionsProps) {
        super(props);
    }

    public solveQuestion(
        questionCode: MatchQuestionCode,
        solution: any
    ): Result<void> {
        const idx = this.value.findIndex((q) => q.code === questionCode);
        if (idx === -1) return Result.fail("Question not found");
        // this.value.push({ code: questionCode, solution, scored: false });
        if (!this.value[idx].solution) {
            this.value[idx].solution = solution;
        }

        return Result.ok<void>();
    }

    public static create(questions?: MatchQuestion[]): Result<MatchQuestions> {
        if (!questions) {
            questions = Object.values(FootballQuestion).map((qc) => ({
                code: qc,
            }));
        }

        return Result.ok<MatchQuestions>(
            new MatchQuestions({ value: questions })
        );
    }
}
