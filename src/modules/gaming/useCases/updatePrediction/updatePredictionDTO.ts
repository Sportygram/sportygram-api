import { RequestUserDTO } from "../../../../lib/utils/permissions";

export interface UpdatePredictionDTO {
    predictionId: string;
    predictions: any;
    requestUser: RequestUserDTO;
}
