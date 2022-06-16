import { WatchedList } from "../../../lib/domain/WatchedList";
import { MatchPrediction } from "./matchPrediction";

export class PlayerMatchPredictions extends WatchedList<MatchPrediction> {
    private constructor(initialPredictions: MatchPrediction[]) {
        super(initialPredictions);
    }

    public compareItems(a: MatchPrediction, b: MatchPrediction): boolean {
        return a.equals(b);
    }

    public static create(
        matchPredictions: MatchPrediction[]
    ): PlayerMatchPredictions {
        return new PlayerMatchPredictions(
            matchPredictions ? matchPredictions : []
        );
    }
}
