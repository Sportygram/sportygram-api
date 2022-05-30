import { RequestUserDTO } from "../../utils/permissions";

declare global {
    namespace Express {
        interface Request {
            requestUser?: RequestUserDTO;
            error?: Error;
        }
    }
}
