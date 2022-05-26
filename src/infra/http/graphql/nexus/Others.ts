import { extendType, objectType } from "nexus";
import { countries } from "../../../../modules/iam/domain/countries";
import { teams } from "./mocks/data";

export const Country = objectType({
    name: "Country",
    definition(t) {
        t.nonNull.string("name");
        t.nonNull.string("code");
        t.nonNull.string("emoji");
    },
});

const UNICODE_BASE = 127462 - "A".charCodeAt(0);
const countriesWithEmojis = countries.map((c) => ({
    ...c,
    emoji: String.fromCodePoint(
        ...c.code
            .split("")
            .map((letter) => UNICODE_BASE + letter.toUpperCase().charCodeAt(0))
    ),
}));

export const OtherQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.field("countries", {
            type: "Country",
            args: {},
            async resolve(_parent, _args, _context, _info) {
                return countriesWithEmojis;
            },
        });

        t.nonNull.list.field("teams", {
            type: "Team",
            args: {},
            async resolve(_parent, _args, _context, _info) {
                return teams;
            },
        });
    },
});