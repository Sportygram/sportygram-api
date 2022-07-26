import { EmailRequest, EmailService, EmailTypes } from "./emailService";
import { config } from "../../config";
import logger from "../../core/Logger";
import AWS from "aws-sdk";
import { verificationTemplate } from "./emailTemplates";

const REGION = "eu-north-1";

const ses = new AWS.SES({ apiVersion: "2012-11-05", region: REGION });
const { domain } = config.huddle;

const templateMap: Record<string, any[]> = {
    [EmailTypes.VerifyEmail]: [verificationTemplate, `hello@${domain}`],
};

export class SESEmailService implements EmailService {
    async sendMail({
        to,
        cc,
        subject,
        templateName,
        templateData,
        sendAt,
    }: EmailRequest): Promise<void> {
        const logData = {
            to,
            templateName,
            templateData,
            sendAt,
        };
        logger.info("SES-SEND", logData);
        const [tFunction] = templateMap[templateName];

        const params = {
            Destination: {
                ...(cc ? { CcAddresses: [cc] } : {}),
                ToAddresses: [to],
            },
            Source: "hello@204070.dev",
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: tFunction(templateData.token),
                    },
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: subject || "",
                },
            },
        };

        try {
            const response = await ses.sendEmail(params).promise();
            logger.info("SES-SEND-SUCCESS", logData, response);
            return;
        } catch (error: any) {
            logger.error("SES-ERROR", {
                ...logData,
                error: error.message,
            });
        }
    }
}
