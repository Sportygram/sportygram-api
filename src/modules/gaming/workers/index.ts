import cron from "node-cron";
import { updateApiFootballLive } from "../useCases/updateLiveMatches";

/*
Automation Strategy

Receive live match notifications from at least one API with notification service

Every 1 minute,
- Fetch next24hours match list from cache sortedSet[matchId: startTime]
- If next24hoursList == null OR lastMatchFetched, 
    - Get all matches that will be played in the next 24hours and save in cache
    - If no matches in the next 24hours, fetch the next match from now and save to cache
- Else,
    - Check each match 
        - If match startTime > 30 seconds before now, set match to in_progress and pop off cache
            NOTE: Only send a kickoff to users when API confirms kickoff
                (if the APIs event latency is not fast enough then use exact time instead of 
                    30sec prior and send a kickoff immediately)
        - If last match has been popped, set lastMatchFetched to true.

Every 2 minutes, 
- update all live matches
    - live matches: matches status=in_progress that have not been updated in the last 1min.
- Prioritize using APIs that allow fetching all live match update in a request
    NOTE (They may be slower so check speed and monetary cost of fetch)
- This will serve as a backup strategy if APIs with a notification system for updates fail


After Live Match Updated,
- For each scorable event, update corresponding questions 
    (question that can be solved by event and does not have solution yet) solution and 
    set question.scored to false (this will actually happen before the event)
- Fetch all match predictions,
- For each prediction, score the prediction and update the user games Summary.
- Update match's question scored to true. 
    This means the question has been scored for all players and we don't need to 
    rescore any players. We might need to rescore if process failed while scoring
    We'll fetch all games that have completed for a while but with a question.scored = false, 
    we then rescore that question for player predictions that were not scored
- Dispatch Match predictions scored event

After Match Predictions Scored,
- Get all live room games (in_progress weekly and season). Notify me if missing game
- Fetch all room users with their game summaries (new scores)
- For each user, update their score on the leaderboard
- Recalculate all user ranks on leaderboard using new scores
- save all old ranks to lastRank
- Update leaderboard ranks with new ranks
- Save room games back to db

Every week at midnight and every 10minutes till 00:30
- Get all room games that have ended but still in_progress
- Calculate summary for the game
- Update the status to completed
- Save room game

After game ended
- Send a message with the game summary for the room and the commencement of a new game
- Create new game
*/

cron.schedule("*/5 * * * *", () => {
    // Every 5 minutes
    updateApiFootballLive.execute({});
});

cron.schedule("* * * * *", () => {
    // Every minute
    // Get all matches: dateTime > now &&, scheduled
    // set all matches to in_progress
    //
});
