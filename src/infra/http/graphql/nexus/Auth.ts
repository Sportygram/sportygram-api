import {
    objectType,
    stringArg,
    nonNull,
    extendType,
    inputObjectType,
    arg,
} from "nexus";
import { createUserResolver } from "../../../../modules/iam/useCases/createUser/createUserResolver";
import { checkUsernameResolver } from "../../../../modules/iam/useCases/checkUsernameAvailability/checkUsernameResolver";
import { changePasswordResolver } from "../../../../modules/iam/useCases/changePassword/changePasswordResolver";
import { loginResolver } from "../../../../modules/iam/useCases/login/loginResolver";
import { verifyEmailResolver } from "../../../../modules/iam/useCases/verifyUserEmail/verifyEmailResolver";
import { withUser } from "./utils";
import { resetPasswordResolver } from "../../../../modules/iam/useCases/resetPassword/resetPasswordResolver";

/* TODO Auth graphql
    - SSO Authentication
    - Add a 
*/

export const AuthOutput = objectType({
    name: "AuthOutput",
    definition(t) {
        t.implements("MutationOutput");
        t.string("accessToken");
        t.string("refreshToken");
        t.nonNull.field("user", { type: "User" });
    },
});

export const TokenSendOutput = objectType({
    name: "TokenSendOutput",
    definition(t) {
        t.implements("MutationOutput");
        t.nonNull.boolean("sent");
    },
});

export const LoginInput = inputObjectType({
    name: "LoginInput",
    definition(t) {
        t.nonNull.string("emailOrUsername");
        t.nonNull.string("password");
        t.ipv4("ip");
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
                password: stringArg(),
                referralCode: stringArg(),
            },
            resolve: createUserResolver,
        });

        t.nonNull.field("changePassword", {
            type: "AuthOutput",
            args: {
                oldPassword: stringArg(),
                newPassword: nonNull(stringArg()),
            },
            resolve: withUser(changePasswordResolver),
        });

        t.nonNull.field("sendEmailVerification", {
            type: "TokenSendOutput",
            args: {
                email: nonNull(stringArg()),
            },
            async resolve(_parent, _args, _context) {
                return {
                    message: "Verification Email Sent",
                    sent: true,
                };
            },
        });

        t.nonNull.field("sendPasswordReset", {
            type: "TokenSendOutput",
            args: {
                email: nonNull(stringArg()),
            },
            async resolve(_parent, _args, _context) {
                return {
                    message: "Password Reset Email Sent",
                    sent: true,
                };
            },
        });

        t.nonNull.field("verifyEmail", {
            type: "AuthOutput",
            args: {
                token: nonNull(stringArg()),
            },
            resolve: withUser(verifyEmailResolver),
        });

        t.nonNull.field("resetPassword", {
            type: "AuthOutput",
            args: {
                userId: nonNull(stringArg()),
                token: nonNull(stringArg()),
                password: nonNull(stringArg()),
            },
            resolve: resetPasswordResolver,
        });

        t.nonNull.field("login", {
            type: "AuthOutput",
            args: {
                input: arg({ type: nonNull(LoginInput) }),
            },
            resolve: loginResolver,
        });

        t.nonNull.field("checkUsername", {
            type: "CheckUsernameOutput",
            args: {
                username: nonNull(stringArg()),
            },
            resolve: withUser(checkUsernameResolver),
        });
    },
});
