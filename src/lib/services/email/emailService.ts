export type EmailRequest = {
    to: string;
    cc?: string;
    bcc?: string[];
    subject?: string;
    templateName: string;
    templateData: Record<string, string>;
    key?: string;
    sendAt?: Date;
};

export enum EmailTypes {
    Welcome = "welcome",
    VerifyEmail = "confirm_email",
    PasswordReset = "password_reset",
}

export interface EmailService {
    sendMail(mailInfo: EmailRequest): Promise<void>;
}
