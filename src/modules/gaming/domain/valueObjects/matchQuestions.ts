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

    public getQuestion(questionCode: MatchQuestionCode): MatchQuestion {
        const question = this.value.find(
            (question) => question.code === questionCode
        );
        if (!question) throw new Error("Question not found");
        return question;
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
            questions = [{ code: FootballQuestion.Winner }];
        }

        return Result.ok<MatchQuestions>(
            new MatchQuestions({ value: questions })
        );
    }
}
