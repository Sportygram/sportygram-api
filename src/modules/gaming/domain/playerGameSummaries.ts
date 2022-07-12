import { WatchedList } from "../../../lib/domain/WatchedList";
import { PlayerGameSummary } from "./gameSummary";

export class PlayerGameSummaries extends WatchedList<PlayerGameSummary> {
    private constructor(initialTokens: PlayerGameSummary[]) {
        super(initialTokens);
    }

    public compareItems(a: PlayerGameSummary, b: PlayerGameSummary): boolean {
        return a.equals(b);
    }

    public static create(tokens: PlayerGameSummary[]): PlayerGameSummaries {
        return new PlayerGameSummaries(tokens ? tokens : []);
    }
}
