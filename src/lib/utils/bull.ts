import Bull from "bull";

export const makeQueue = (queueName: string) => {
    return new Bull(queueName);
};
