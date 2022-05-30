import { config } from "../../config";
import { EmailServiceImpl } from "./emailServiceImpl";
import { SendgridService } from "./sendgridService";
import { TestMailService } from "./testMailService";

const sendgrid: any = config.sendgrid;

export const sendgridEmailService = new SendgridService(sendgrid.apiKey);
export const testEmailService = new TestMailService();
export const emailService = new EmailServiceImpl(sendgridEmailService);
