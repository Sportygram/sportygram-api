export const config = {
    sportygram: {
        defaultUserRole: "unverified_email_user",
        verifiedUserRole: "user",
        defaultProfileColour: "6E6CCA",
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
        serviceAccount: {
            type: "service_account",
            project_id: process.env.FIREBASE_PROJECT_ID,
            private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
            // See: https://stackoverflow.com/a/50376092/3403247.
            private_key: (
                process.env.FIREBASE_ADMIN_PRIVATE_KEY as string
            ).replace(/\\n/g, "\n"),
            client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
            auth_uri: "https://accounts.google.com/o/oauth2/auth",
            token_uri: "https://oauth2.googleapis.com/token",
            auth_provider_x509_cert_url:
                process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
            client_x509_cert_url:
                process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
        },
    },
    getStream: {
        apiKey: process.env.STREAM_KEY,
        apiSecret: process.env.STREAM_SECRET,
        defaultChannelOwnerId: "e3a2060e-51a4-4852-bbdc-582da830df89",
    },
};
