export const verificationTemplate = (token: string) => {
    return `
        <div>
            <h1>Hello,</h1>
            <p>
                Please use the code below to verify your email address.
            </p>
            <strong><p>${token}</p></strong>
        </div>
    `;
}