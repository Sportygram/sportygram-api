import { booleanArg, extendType, objectType, stringArg } from "nexus";
// import { getMatchMock } from "./mocks/Fixtures";
import { fixturesResolver } from "../../../../modules/gaming/useCases/fetchFixtures/fetchFixturesResolver";
import { withUser } from "./utils";

export const Competition = objectType({
    name: "Competition",
    definition(t) {
        t.nonNull.id("id");
        t.nonNull.string("name");
        t.nonNull.string("sport");
        t.nonNull.string("short");
        t.string("logo");
        t.string("country");
        t.string("countryCode");
        t.string("season");
        t.dateTime("startDate")
        t.dateTime("endDate")
    },
});

export const MatchStatus = objectType({
    name: "MatchStatus",
    definition(t) {
        t.string("long");
        t.string("short");
        t.int("timeElapsed");
    },
});
export const MatchPeriod = objectType({
    name: "MatchPeriod",
    definition(t) {
        t.dateTime("first");
        t.dateTime("firstExtra");
        t.dateTime("second");
        t.dateTime("secondExtra");
        t.dateTime("penalties");
    },
});

export const MatchStatistic = objectType({
    name: "MatchStatistic",
    definition(t) {
        t.string("type");
        t.string("value");
    },
});

export const LineUpPlayer = objectType({
    name: "LineUpPlayer",
    definition(t) {
        t.string("id");
        t.string("name");
        t.string("position");
        t.string("number");
    },
});

export const PlayerPositions = objectType({
    name: "PlayerPositions",
    definition(t) {
        t.nonNull.list.field("GK", { type: "LineUpPlayer" });
        t.nonNull.list.field("D", { type: "LineUpPlayer" });
        t.nonNull.list.field("M", { type: "LineUpPlayer" });
        t.nonNull.list.field("F", { type: "LineUpPlayer" });
    },
});

export const Team = objectType({
    name: "Team",
    definition(t) {
        t.nonNull.id("id");
        t.nonNull.string("name");
        t.nonNull.string("code");
        t.nonNull.string("logo");
        t.string("stadium");
        t.string("competition");
        t.string("score");
        t.boolean("winner");
        t.list.field("statistics", { type: "MatchStatistic" });
        t.field("players", { type: "PlayerPositions" });
        t.json("colours");
    },
});

export const TeamData = objectType({
    name: "TeamData",
    definition(t) {
        t.field("home", { type: "Team" });
        t.field("away", { type: "Team" });
    },
});

export const Match = objectType({
    name: "Match",
    definition(t) {
        t.id("id");
        t.nonNull.string("name");
        t.nonNull.field("teams", { type: "TeamData" });
        t.nonNull.field("status", { type: "MatchStatus" });
        t.nonNull.dateTime("dateTime");
        t.nonNull.field("periods", { type: "MatchPeriod" });
        t.nonNull.string("season");
        t.nonNull.string("competitionId");
        t.string("venue");
        t.string("winner");
        t.int("userPoints");
        t.list.field("predictions", { type: "Prediction" });
        t.json("misc");
    },
});

export const FixturesQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("fixtures", {
            type: "Match",
            args: {
                date: stringArg(),
                live: booleanArg(),
                sport: stringArg(),
            },
            // async resolve(_parent, _args, _context, _info) {
            //     return [getMatchMock()];
            // },
            resolve: withUser(fixturesResolver),
        });
    },
});
