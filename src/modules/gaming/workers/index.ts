import cron from "node-cron";
import { endGames } from "../useCases/endGames";
import { setMatchesStartingNowToInProgress } from "../useCases/setMatchesStartingNowToInProgress";
import { updateApiFootballLive } from "../useCases/updateLiveMatches";

/*
Automation Strategy

- Receive live match notifications from at least one API with notification service

Every 1 minute,
- Fetch next24hours match list from cache sortedSet[matchId: startTime]
- If next24hoursList is empty,
    - Get all matches that will be played in the next 24hours and save in cache
    - If no matches in the next 24hours, fetch the next upcoming match from now and save to cache
- Else,
    - Check each match 
        - If match startTime > 30 seconds before now, set match to in_progress and pop off cache
            NOTE: Only send a kickoff to users when API confirms kickoff
                (if the APIs event latency is not fast enough then use exact time instead 
                    of 30sec prior and send a kickoff immediately)

Every 2 minutes, 
- update all live matches
    - live matches: matches status=in_progress that have not been updated in the last 1min.
- Prioritize using APIs that allow fetching all live match update in a request
    NOTE (They may be slower so check speed and monetary cost of fetch)
- This will serve as a backup strategy if APIs with a notification system for updates fail 

After Live Match Updated,
- For each scorable event, update corresponding questions solution
    (question that can be solved by event and does not have solution yet)
- Trigger MatchQuestionAnswered event for match
- Send notification with updates to users

After Match Complete
- Answer any questions that are not yet answered
- Trigger MatchQuestionAnswered event for match

After Match Question Answered
- Fetch all match predictions,
- For each prediction in each matchPrediction, score the prediction if it's question
    has been solved,
    - Update prediction's scored to true
    (each prediction will only be scored once)
- add the score for the newly scored predictions to the totalpoints for 
    the currently running user gameSummaries (weekly and season) for competition.
- Dispatch Match predictions scored event

After Match Predictions Scored,
- Get all live room games for competition (in_progress weekly and season). Notify me if missing game
- Fetch all room users with their in_progress game summaries (new scores)
- For each user, update their score on the leaderboard
- Recalculate all user ranks on leaderboard using new scores
- save all old ranks to lastRank
- Update leaderboard ranks with new ranks
- Save room games back to db

Every week at midnight and every 10minutes till 00:30
- Get all ended games that have ended but still in_progress
- Get all room games for the ended games
- Calculate summary for each room game
- Save room games with summary to db and status completed (
    room game must only be completed once so the summary message goes out once
    even if the end game calls for a game again)
- Get all user game summaries
- Calculate summary for each user game
- Save user games with summary to db and status completed
- Update game status to completed
- Save game to db;
- Trigger game ended

After room game ended
- Send a message with the game summary for the room and the commencement of a new game

After user game ended
- Send a message with the game summary for the user and the commencement of a new game

After game ended
- Create new game
- Create new room game for all rooms
    new rooms will automatically trigger creation of all corresponding room games
- Create new user game summaries for all users
    new users will automatically trigger creation of all corresponding user game summaries


TODO: Every day at midnight
- Check upcoming (next 2weeks) unscheduled match for dateTime updates
*/

cron.schedule("*/5 * * * *", () => {
    // Every 5 minutes
    updateApiFootballLive.execute({});
});

cron.schedule("* * * * *", () => {
    // Every minute
    setMatchesStartingNowToInProgress.execute({});
});

// */10 0-1 * * 0
cron.schedule("*/10 0-1 * * 0", () => {
    // Every 10 minutes from 00:00 to 01:00 on Sunday
    endGames.execute({});
});
