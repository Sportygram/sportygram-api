import { Result } from "../../../lib/core/Result";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { User } from "../domain/user";
import { UserEmail } from "../domain/valueObjects/userEmail";
import { UserPassword } from "../domain/valueObjects/userPassword";
import { UserRoles } from "../domain/userRoles";
import { UserTokens } from "../domain/userTokens";
import { UserState } from "../../../lib/utils/permissions";
import { sgramAdminRoleProp, userRoleProp } from "./role.mock";
import { ReferralCode } from "../domain/valueObjects/referralCode";

const superAdminProp = {
    id: "1ef0d6ce-fb4b-4162-99a8-7b132c42b2a0",
    email: "god@sgram.com",
    password: "Pa55w0rd",
    firstname: "God",
    lastname: "IAM",
    userState: UserState.Active,
    createdAt: "2020-10-22T07:47:17.984Z",
    updatedAt: "2020-10-22T07:47:17.984Z",
    roles: [sgramAdminRoleProp],
    permissions: [],
};

const userProp = {
    id: "3981de33-84a7-4bb9-8b7c-ec71ddd6be95",
    email: "takumi@sgram.com",
    password: "Pa55w0rd",
    firstname: "Takumi",
    lastname: "Fujiwara",
    userState: "active",
    createdBy: superAdminProp.id,
    createdAt: "2020-10-22T07:47:17.984Z",
    updatedAt: "2020-10-22T07:47:17.984Z",
    roles: [userRoleProp],
    permissions: [],
};

const createMockUser = (testUserProp: any) => {
    const emailOrError = UserEmail.create(testUserProp.email);
    const passwordOrError = UserPassword.create({
        value: testUserProp.password,
    });
    const referralCodeOrError = ReferralCode.create();

    const email: UserEmail = emailOrError.getValue();
    const passwordHash: UserPassword = passwordOrError.getValue();
    const referralCode: ReferralCode = referralCodeOrError.getValue();

    const roles = UserRoles.create([]);
    const tokens = UserTokens.create([]);

    const userOrError: Result<User> = User.create(
        {
            email,
            passwordHash,
            referralCode,
            userState: testUserProp.userState,
            roles,
            tokens,
        },
        new UniqueEntityID(testUserProp.id)
    );

    return userOrError.getValue();
};

const getMockCustomer = () => createMockUser(userProp);
const getMockSuperAdmin = () => createMockUser(superAdminProp);

const getMockUsers = () => {
    const users = [userProp, superAdminProp];
    return users.map(createMockUser);
};

const userRequestUser = {
    userId: userProp.id,
    roles: ["user"],
    state: "active",
    permissions: ["me"],
};

export {
    userProp,
    superAdminProp,
    userRequestUser,
    getMockCustomer,
    getMockSuperAdmin,
    getMockUsers,
};
