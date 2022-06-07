export const config = {
    sportygram: {
        defaultUserRole: "unverified_email_user",
        verifiedUserRole: "user",
        defaultProfileColour: "#6E6CCA",
        defaultProfileImage:
            "https://i.pinimg.com/474x/65/25/a0/6525a08f1df98a2e3a545fe2ace4be47.jpg",
        domain: "sportygram.com",
    },
    auth: {
        secret: process.env.AUTH_SECRET || "top-secret",
        authTokenExpiresInSeconds: 3600,
        refreshTokenExpiresInSeconds: 86400,
    },
    redis: {
        url: process.env.REDIS_URL || "redis://localhost:6379",
    },
    sendgrid: {
        apiKey: process.env.SENDGRID_KEY || "SG.",
    },
    aws: {
        s3BucketName: "sgram-prod-s3",
    },
    firebase: {
        refreshToken: "",
        databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
    },
    getStream: {
        apiKey: process.env.STREAM_KEY,
        apiSecret: process.env.STREAM_SECRET,
        defaultChannelOwnerId: "e3a2060e-51a4-4852-bbdc-582da830df89",
    },
};
