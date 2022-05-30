import logger from "../../core/Logger";
import { EmailRequest, EmailService } from "./emailService";
import { SendgridService } from "./sendgridService";

export class EmailServiceImpl implements EmailService {
    constructor(private sendgridService: SendgridService) {}

    async sendMail(mailInfo: EmailRequest): Promise<void> {
        this.sendgridService.sendMail(mailInfo).catch((error) => {
            logger.error("EMAIL_SERVICE_ERROR", { process: "sendMail", error });
        });
    }
}
