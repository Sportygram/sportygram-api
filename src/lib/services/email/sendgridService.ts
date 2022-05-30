import sgMail, { MailService as SendGridMailService } from "@sendgrid/mail";
import { EmailRequest, EmailService, EmailTypes } from "./emailService";
import dayjs from "dayjs";
import logger from "../../core/Logger";
import { config } from "../../config";

const { domain } = config.sportygram;
const templateNameIDMap: Record<string, string[]> = {
    [EmailTypes.Welcome]: [
        "65ae786b0256477dbad152f06aca857d",
        `hello@${domain}`,
    ], // New user registration
    [EmailTypes.PasswordReset]: [
        "2e0b2ba472d94c1798e9b92a08ff6386",
        `hello@${domain}`,
    ], // Password Reset
};

export class SendgridService implements EmailService {
    private sendgrid: SendGridMailService;

    constructor(apiKey: string) {
        sgMail.setApiKey(apiKey);
        this.sendgrid = sgMail;
    }

    async sendMail({
        to,
        cc,
        bcc,
        subject,
        templateName,
        templateData,
        sendAt,
    }: // key,
    EmailRequest): Promise<void> {
        const logData = {
            to,
            templateName,
            templateData,
            sendAt,
        };
        try {
            const [tid, email] = templateNameIDMap[templateName];
            logger.info("SENDGRID-SEND", logData);
            const msg = {
                to,
                from: {
                    email: email || `no-reply@${domain}`,
                    name: "Sportygram",
                },
                cc,
                bcc,
                subject,
                templateId: `d-${tid}`,
                dynamic_template_data: templateData,
                sendAt: dayjs(sendAt).unix(),
            };

            logger.info("SENDGRID_DATA", msg);
            await this.sendgrid.send(msg);
            // const sendF = (msgArgs: any) =>
            //     this.sendgrid.send.bind(this, msgArgs);
            // const send = debounce(sendF, 3000);
            // send(key || `${templateName}_${to}`, msg);
        } catch (error: any) {
            error.response
                ? logger.error("SENDRID-ERROR", logData)
                : logger.error("SENDRID-ERROR", {
                      ...logData,
                      error: error.response?.body,
                  });
        }
    }
}
