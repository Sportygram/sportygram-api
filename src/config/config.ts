export const config = {
    sportygram: {
        organizationId: "9661a346-889e-4619-8f68-a5f0eaa2e887",
        defaultUserRole: "free_customer",
    },
    redis: {
        url: process.env.REDIS_URL || "redis://localhost:6379",
    },
};
