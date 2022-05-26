import { arg, extendType, inputObjectType, nonNull, objectType } from "nexus";
import { getUserMock } from "./mocks/Auth";

/* TODO: User graphql
    - Update Interests and favorite team details
    - Purchase coins
    - updateSettings
*/

export const User = objectType({
    name: "User",
    definition(t) {
        t.nonNull.email("email");
        t.nonNull.id("userId");
        t.nonNull.list.string("roles");
        t.string("username");
        t.string("firstname");
        t.string("lastname");
        t.string("country");
        t.nonNull.string("userState");
        t.nonNull.boolean("emailVerified");
        t.nonNull.string("referralCode");
        t.nonNull.int("referralCount");
        t.phone("phone");
        t.string("profileImageUrl");
        t.nonNull.boolean("onboarded");
        t.nonNull.float("coinBalance");
        t.list.field("rooms", { type: "Room" });
        t.json("settings")
        t.json("gamesSummary")
        t.nonNull.dateTime("createdAt");
        t.nonNull.dateTime("updatedAt");
    },
});

export const UserQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.field("viewer", {
            type: "User",
            args: {},
            async resolve(_parent, _args, _context, _info) {
                return getUserMock({
                    username: "united",
                });
            },
        });
    },
});

export const UpdateUserProfileInput = inputObjectType({
    name: "UpdateUserProfileInput",
    definition(t) {
        t.string("username");
        t.string("firstname");
        t.string("lastname");
        t.string("country");
        t.string("favoriteTeam")
    },
});

export const UpdateUserProfileOutput = objectType({
    name: "UpdateUserProfileOutput",
    definition(t) {
        t.implements("MutationOutput");
        t.nonNull.field("user", { type: "User" });
    },
});

export const UserMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("updateUserProfile", {
            type: "UpdateUserProfileOutput",
            args: {
                data: arg({ type: nonNull(UpdateUserProfileInput) }),
            },
            async resolve(_parent, args, _context) {
                return {
                    user: getUserMock(args.data),
                    message: "User Updated",
                };
            },
        });
    },
});
