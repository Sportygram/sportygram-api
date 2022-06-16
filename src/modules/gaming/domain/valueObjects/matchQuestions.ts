import { Result } from "../../../../lib/core/Result";
import { ValueObject } from "../../../../lib/domain/ValueObject";
import { MatchQuestion } from "../types";

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

    public static create(questions: MatchQuestion[]): Result<MatchQuestions> {
        for (let question of questions) {
            const { code, type } = question;

            if (!code || !type)
                return Result.fail<MatchQuestions>(
                    `question must have a code and a type`
                );
        }

        return Result.ok<MatchQuestions>(
            new MatchQuestions({ value: questions })
        );
    }
}
