import { liveMatches } from "./apiFootballData.data";
import { fixtureDataToMatchDTOMap } from "./apiFootballService";

test.skip("Api Football Live Match is Mapped to huddle match correctly", async () => {
    const matchdto = await fixtureDataToMatchDTOMap(liveMatches[1] as any);

    expect(matchdto.teams.length).toBe(2);
});
