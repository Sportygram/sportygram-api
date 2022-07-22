import { config } from "../../config";
import { SESEmailService } from "./sesEmailService";
import { EmailServiceImpl } from "./emailServiceImpl";
import { SendgridService } from "./sendgridService";
import { TestMailService } from "./testMailService";

const sendgrid: any = config.sendgrid;

export const sendgridEmailService = new SendgridService(sendgrid.apiKey);
export const testEmailService = new TestMailService();
export const sesEmailService = new SESEmailService();
export const emailService =
    process.env.NODE_ENV === "test"
        ? new EmailServiceImpl(testEmailService)
        : new EmailServiceImpl(sesEmailService);
