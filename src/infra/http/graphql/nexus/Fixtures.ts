import { extendType, nonNull, objectType, stringArg } from "nexus";
import { getFixtureMock } from "./mocks/Fixtures";

export const MatchStatus = objectType({
    name: "MatchStatus",
    definition(t) {
        t.string("long");
        t.string("short");
        t.int("timeElapsed");
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
        t.id("code");
        t.string("name");
        t.string("logo");
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

export const Fixture = objectType({
    name: "Fixture",
    definition(t) {
        t.id("fixtureId");
        t.nonNull.dateTime("date");
        t.string("venue");
        t.list.nonNull.int("periods");
        t.nonNull.field("teams", { type: "TeamData" });
        t.json("scores");
        t.list.field("predictions", { type: "Prediction" });
        t.nonNull.json("misc");
    },
});

export const FixturesQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("fixtures", {
            type: "Fixture",
            args: {
                date: nonNull(stringArg()),
            },
            async resolve(_parent, _args, _context, _info) {
                return [getFixtureMock()];
            },
        });
    },
});
