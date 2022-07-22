import logger from "../../core/Logger";
import { EmailRequest, EmailService } from "./emailService";

export class EmailServiceImpl implements EmailService {
    constructor(private mailService: EmailService) {}

    async sendMail(mailInfo: EmailRequest): Promise<void> {
        this.mailService.sendMail(mailInfo).catch((error) => {
            logger.error("EMAIL_SERVICE_ERROR", { process: "sendMail", error });
        });
    }
}
