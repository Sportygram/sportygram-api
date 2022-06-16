import { RequestUserDTO } from "../../../../lib/utils/permissions";

export interface MakePredictionDTO {
    matchId: string;
    userId: string;
    predictions: any
    requestUser: RequestUserDTO
}