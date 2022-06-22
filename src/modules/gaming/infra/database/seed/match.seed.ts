import { apiFootballService } from "../../../services/footballService";
import { createMatch } from "../../../useCases/createMatch";

export async function seedMatches() {
    // fetch all fixtures
    const fixturesDTO = await apiFootballService.getFixtures();

    const results = await Promise.all(
        fixturesDTO.map(async (match) => {
            // save to db
            const result = await createMatch.execute(match);
            if (result.isRight()) {
                return { success: true };
            } else {
                return {
                    success: false,
                    error: result.value.errorValue().message,
                    match,
                };
            }
        })
    );

    const summary = results.reduce<{
        successCount: number;
        failureCount: number;
        failedMatches: any[];
    }>(
        (prevSummary, result) => {
            !result.success &&
                prevSummary.failedMatches.push(
                    result.match?.sources.apiFootball.id
                );
            return {
                successCount:
                    prevSummary.successCount + (result.success ? 1 : 0),
                failureCount:
                    prevSummary.failureCount + (result.success ? 0 : 1),
                failedMatches: prevSummary.failedMatches,
            };
        },
        { successCount: 0, failureCount: 0, failedMatches: [] }
    );

    const result = {
        total: fixturesDTO.length,
        ...summary,
    };
    console.log(result);
    return result;
}
