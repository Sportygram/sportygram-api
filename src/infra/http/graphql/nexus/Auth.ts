import {
    objectType,
    stringArg,
    nonNull,
    extendType,
    inputObjectType,
    arg,
} from "nexus";
import { accessTokenMock, getUserMock, refreshTokenMock } from "./mocks/Auth";

/* TODO Auth graphql
    - SSO Authentication
*/
export const AuthOutput = objectType({
    name: "AuthOutput",
    definition(t) {
        t.implements("MutationOutput");
        t.nonNull.string("accessToken");
        t.nonNull.string("refreshToken");
        t.nonNull.field("user", { type: "User" });
    },
});

export const LoginInput = inputObjectType({
    name: "LoginInput",
    definition(t) {
        t.nonNull.string("emailOrUsername");
        t.nonNull.string("password");
        t.nonNull.string("ip");
    },
});

export const CheckUsernameOutput = objectType({
    name: "CheckUsernameOutput",
    definition(t) {
        t.implements("MutationOutput");
        t.nonNull.boolean("available");
    },
});

export const AuthMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("signup", {
            type: "AuthOutput",
            args: {
                email: nonNull(stringArg()),
                password: nonNull(stringArg()),
            },
            async resolve(_parent, _args, _context) {
                return {
                    message: "User Account created",
                    accessToken: accessTokenMock,
                    refreshToken: refreshTokenMock,
                    user: getUserMock(),
                };
            },
        });

        t.nonNull.field("login", {
            type: "AuthOutput",
            args: {
                input: arg({ type: nonNull(LoginInput) }),
            },
            async resolve(_parent, _args, _context) {
                return {
                    message: "User Authentication token created",
                    accessToken: accessTokenMock,
                    refreshToken: refreshTokenMock,
                    user: getUserMock({
                        username: "bleh",
                    }),
                };
            },
        });

        t.nonNull.field("checkUsername", {
            type: "CheckUsernameOutput",
            args: {
                username: nonNull(stringArg()),
            },
            async resolve(_parent, _args, _context) {
                return {
                    available: true,
                    message: "Username is available",
                };
            },
        });
    },
});
