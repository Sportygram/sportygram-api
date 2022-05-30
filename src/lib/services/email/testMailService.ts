import { EmailRequest, EmailService } from "./emailService";

export class TestMailService implements EmailService {
    private emailRequests: EmailRequest[];
    constructor() {
        this.emailRequests = [];
    }

    get emails() {
        return this.emailRequests;
    }

    async sendMail(mailInfo: EmailRequest): Promise<void> {
        this.emailRequests.push(mailInfo);
    }
}
