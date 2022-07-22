import { EmailRequest, EmailService, EmailTypes } from "./emailService";
import { config } from "../../config";
import logger from "../../core/Logger";
import AWS from "aws-sdk";
import { verificationTemplate } from "./emailTemplates";

const REGION = "eu-west-1";

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
        const [tFunction, Source] = templateMap[templateName];

        const params = {
            Destination: {
                ...(cc ? { CcAddresses: [cc] } : {}),
                ToAddresses: [to],
            },
            Source,
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
            await ses.sendEmail(params).promise();
        } catch (error: any) {
            logger.error("SES-ERROR", {
                ...logData,
                error: error.message,
            });
        }
    }
}
