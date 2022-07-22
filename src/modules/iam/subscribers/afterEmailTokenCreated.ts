import { EmailTokenCreated } from "../domain/events/emailTokenCreated";
import { IHandle } from "../../../lib/domain/events/IHandle";
import {
    DomainEvents,
    RegisterCallback,
} from "../../../lib/domain/events/DomainEvents";
import logger from "../../../lib/core/Logger";
import {
    EmailService,
    EmailTypes,
} from "../../../lib/services/email/emailService";
import { TokenType } from "../domain/token";

export class AfterEmailTokenCreated implements IHandle<EmailTokenCreated> {
    constructor(private emailService: EmailService) {
        this.setupSubscriptions();
    }

    setupSubscriptions(): void {
        // Register to the domain event
        DomainEvents.register(
            this.onUserCreated.bind(this) as RegisterCallback,
            EmailTokenCreated.name
        );
    }

    private async onUserCreated(event: EmailTokenCreated): Promise<void> {
        const { user } = event;

        try {
            const newToken = user.tokens.getNewItems()[0];
            if (newToken.type === TokenType.PasswordReset) {
                await this.emailService.sendMail({
                    to: user.email.value,
                    subject: "Huddle Password Reset",
                    templateName: EmailTypes.PasswordReset,
                    templateData: {
                        userId: user.userId.id.toString(),
                        token:
                            user
                                .getTokenByType(TokenType.PasswordReset)
                                ?.id.toString() || "",
                    },
                });
            }
            if (newToken.type === TokenType.EmailVerification) {
                await this.emailService.sendMail({
                    to: user.email.value,
                    subject: "Huddle Email Verification",
                    templateName: EmailTypes.VerifyEmail,
                    templateData: {
                        userId: user.userId.id.toString(),
                        token:
                            user
                                .getTokenByType(TokenType.EmailVerification)
                                ?.id.toString() || "",
                    },
                });
            }

            logger.info(
                `[AfterUserCreated]: Successfully executed SendMail use case Email Token Created`,
                {
                    userId: user.userId,
                    email: user.email.value,
                    tokenType: newToken.type,
                }
            );
        } catch (err) {
            logger.error(`[AfterUserCreated]: ${err.message}`, {
                userId: user.userId,
            });
        }
    }
}
