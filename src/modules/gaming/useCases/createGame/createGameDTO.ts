export interface CreateGameDTO {
    name: string;
    description: string;
    roomId: string;
    competitionId: string;
    type: string;
    expiringAt: Date;
}
