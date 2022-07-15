import { RequestUserDTO } from "../../../../lib/utils/permissions";

export interface UnlockPredictionDTO {
    predictionId: string;
    requestUser: RequestUserDTO;
}
