import { EmailTypes } from "./emailService";
import { SESEmailService } from "./sesEmailService";

test.skip("Test email service sendds email", async () => {
    const emailService = new SESEmailService();
    const result = emailService.sendMail({
        to: "lere.akinwunmi@gmail.com",
        subject: "Huddle Email Verification",
        templateName: EmailTypes.VerifyEmail,
        templateData: {
            userId: "lol",
            token: "12345",
        },
    });

    expect(result).resolves.not.toThrowError();
});
