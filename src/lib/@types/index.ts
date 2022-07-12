export type Pagination = {
    total: number;
    page: number;
    perPage: number;
    pages?: number;
};

export const Platform = ["web", "android", "ios"] as const;
export type Platform = typeof Platform[number];

export const Interval = {
    Days: "days",
    Weeks: "weeks",
    Months: "months",
    Years: "years",
} as const;
export type Interval = typeof Interval[keyof typeof Interval];

export interface Summary {
    total?: number;
    successCount: number;
    failureCount: number;
    failed: any[];
}