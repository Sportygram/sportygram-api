import { userProp, superAdminProp } from "../../../mocks/user.mock";

export const UserSeed = [
    {
        id: superAdminProp.id,
        password_hash:
            "$2a$05$u5cAeXFp0wFBxz1tZIkju.YC20D7j8DfJGsNRdJmLkLTT1G67uIcC",
        email: superAdminProp.email,
        roles: [{ id: "dac79693-ca78-4051-b600-951ee07cc38b" }],
    },

    {
        id: userProp.id,
        password_hash:
            "$2a$05$VUfUc4QUgk9JcrlLU4JQueksMnm7FS3lL18gem23jk80God0zzTDW",
        email: userProp.email,
        roles: [{ id: "7c268d7f-8d9d-483d-832b-6e7f43392977" }],
        firstname: userProp.firstname,
        lastname: userProp.lastname,
        profile: {
            id: "7748c683-f5e9-4931-8de0-65af964d0f4c",
            referral_code: "ae8-6gt",
            settings: { defaultCurrency: "USD" },
            user_id: userProp.id,
        },
    },
];
