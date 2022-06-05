import { config } from "../../../../lib/config";
import { GetStreamServiceImpl } from "./getStreamService";

export const streamService = new GetStreamServiceImpl(config.getStream);
