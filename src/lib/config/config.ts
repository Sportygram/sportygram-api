export const config = {
    sportygram: {
        defaultUserRole: "unverified_email_user",
        verifiedUserRole: "user",
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
        apiKey: "SG.",
    },
    aws: {
        s3BucketName: "sgram-prod-s3",
    },
};
