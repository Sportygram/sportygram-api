import { NexusGenObjects } from "../../nexus-typegen";
import { getRoomMock } from "./Messaging";

type User = NexusGenObjects["User"];
let userDefault: User = {
    email: "acheeroku@gmail.com",
    userId: "3658e8d9-2027-4535-9770-d534dd6a8d9c",
    roles: ["user"],
    firstname: "Oluwaseun",
    lastname: "Olalere",
    userState: "active",
    emailVerified: true,
    referralCode: "TOA-E86",
    referralCount: 0,
    coinBalance: 0.0,
    phone: "+2348031234567",
    profileImageUrl:
        "https://i.pinimg.com/474x/65/25/a0/6525a08f1df98a2e3a545fe2ace4be47.jpg",
    onboarded: true,
    country: "NG",
    createdAt: "2022-05-19T01:45:57.686Z",
    updatedAt: "2022-05-19T01:45:57.686Z",
    rooms: [getRoomMock()],
    settings: {
        hello: "world",
        bgColor: "blue",
    },
};

export const getEmptyUserMock = (p?: Partial<User>): User => ({
    ...userDefault,
    firstname: null,
    lastname: null,
    emailVerified: false,
    onboarded: false,
    phone: null,
    profileImageUrl: null,
    country: null,
    rooms: [],
    ...p,
});

export const getUserMock = (p?: Partial<User>): User => ({
    ...userDefault,
    ...p,
});

export const accessTokenMock =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFjaGVlcm9rdUBnbWFpbC5jb20iLCJ1c2VySWQiOiI4MmM4MDYxOS1hMGNhLTQ4YzgtYTIwMS1mOTE3ZWI2NjViZDMiLCJyb2xlIjoiQ1VTVE9NRVIiLCJzdGF0ZSI6IklOQUNUSVZFIiwib3JnYW5pemF0aW9uSWQiOiI5NjYxYTM0Ni04ODllLTQ2MTktOGY2OC1hNWYwZWFhMmU4ODciLCJpYXQiOjE2MTI5NDc3NjQsImV4cCI6MTYxMjk1MTM2NH0.FiyWR2KxuoE9tlgOI8rB8rVnCnx01jbvUSs4E6w156c";
export const refreshTokenMock =
    "Sob5FrfvzUFwLL4sLIJKFOmO0xIDOQp04OHDMrqqflgPiQXiCpf9kYuDjJ2AXg8MvSNo0WZt8dO3ARZ31M77WVZLCicsrT6OCcZH2mgkxPSt95NjhORd3vOHTwNqdtQcHoBZKUGPXrUUzsHt49c4DV9HTI60YxW1FCduQgpRLruzG2p2SdpOdRJDFs2AtYI0dPOteJBS3veunZlLyGsZ7mdbLWLTHjFJl7d3T3g2dkACjILxhj3k1OvB31aERVlu";
