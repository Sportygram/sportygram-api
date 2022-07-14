import { RequestUserDTO } from "../../../../lib/utils/permissions";

export interface UpdatePredictionDTO {
    matchId: string;
    predictions: any;
    requestUser: RequestUserDTO;
}
