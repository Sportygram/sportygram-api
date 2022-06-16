import { booleanArg, extendType, objectType, stringArg } from "nexus";
import { getMatchMock } from "./mocks/Fixtures";
// import { fixturesResolver } from "../../../../modules/gaming/useCases/fetchFixtures/fetchFixturesResolver";

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

export const Team = objectType({
    name: "Team",
    definition(t) {
        t.nonNull.id("id");
        t.nonNull.string("name");
        t.nonNull.string("code");
        t.nonNull.string("logo");
        t.string("stadium");
        t.string("score");
        t.boolean("winner");
        t.list.field("statistics", { type: "MatchStatistic" });
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
        t.nonNull.field("teams", { type: "TeamData" });
        t.nonNull.field("status", { type: "MatchStatus" });
        t.nonNull.dateTime("dateTime");
        t.nonNull.field("periods", { type: "MatchPeriod" });
        t.nonNull.string("season");
        t.string("venue");
        t.string("winner");
        t.json("scores");
        t.list.field("questions", { type: "Prediction" });
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
            },
            async resolve(_parent, _args, _context, _info) {
                return [getMatchMock()];
            },
        });
    },
});
