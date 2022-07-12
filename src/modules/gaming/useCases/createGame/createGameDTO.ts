export interface CreateGameDTO {
    name: string;
    description?: string;
    competitionId: string;
    type: string;
    expiringAt: string;
}
