import { extendType, objectType } from "nexus";
import { countries } from "../../../../modules/iam/domain/countries";
import { teams } from "../../../../modules/gaming/infra/database/seed/team.seed";
import { CacheScope } from "apollo-server-types";
import { competitions } from "../../../../modules/gaming/infra/database/seed/gaming.seed";

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
            async resolve(_parent, _args, _context, info) {
                info.cacheControl.setCacheHint({
                    maxAge: 3600,
                    scope: CacheScope.Public,
                });
                return countriesWithEmojis;
            },
        });

        t.nonNull.list.field("teams", {
            type: "Team",
            args: {},
            async resolve(_parent, _args, _context, info) {
                info.cacheControl.setCacheHint({
                    maxAge: 3600,
                    scope: CacheScope.Public,
                });
                return teams;
            },
        });

        t.nonNull.list.field("competitions", {
            type: "Competition",
            args: {},
            async resolve(_parent, _args, _context, info) {
                info.cacheControl.setCacheHint({
                    maxAge: 3600,
                    scope: CacheScope.Public,
                });
                return competitions;
            },
        });
    },
});
