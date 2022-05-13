import { objectType, stringArg, nonNull, extendType } from "nexus";
import { accessTokenMock, getUserMock, refreshTokenMock } from "./mocks/Auth";

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
        t.string("userState");
        t.nonNull.string("referralCode");
        t.phone("phone");
        t.string("profileImageUrl");
        t.nonNull.boolean("onboarded");
        t.dateTime("createdAt");
        t.dateTime("updatedAt");
    },
});

export const AuthPayload = objectType({
    name: "AuthPayload",
    definition(t) {
        t.nonNull.string("accessToken");
        t.nonNull.string("refreshToken");
        t.nonNull.field("user", { type: "User" });
    },
});

export const AuthMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("signup", {
            type: "AuthPayload",
            args: {
                email: nonNull(stringArg()),
                password: nonNull(stringArg()),
                name: nonNull(stringArg()),
            },
            async resolve(_parent, _args, _context) {
                return {
                    accessToken: accessTokenMock,
                    refreshToken: refreshTokenMock,
                    user: getUserMock(),
                };
            },
        });
        t.nonNull.field("login", {
            type: "AuthPayload",
            args: {
                email: nonNull(stringArg()),
                password: nonNull(stringArg()),
                ip: stringArg(),
            },
            async resolve(_parent, _args, _context) {
                return {
                    accessToken: accessTokenMock,
                    refreshToken: refreshTokenMock,
                    user: getUserMock({
                        username: "bleh",
                    }),
                };
            },
        });
    },
});
