import { updateUserFCMTopics } from "../useCases/updateUserFCMTopics";
import { AfterFCMTokenUpdated } from "./afterFCMTokenUpdated";

new AfterFCMTokenUpdated(updateUserFCMTopics);
