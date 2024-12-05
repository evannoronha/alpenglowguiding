import { Resend } from "resend";

export const sendEmail = async (name: string, email: string, htmlContent: string, from: string, to: string, key: string) => {
    // TODO: Pass via env
    const resend = new Resend(key);
    const sendResend = await resend.emails.send({
        from: from,
        replyTo: email as string,
        to: to,
        subject: `Submission from ${name}`,
        html: htmlContent,
    }); // If the message was sent successfully, return a 200 response

    if (sendResend.data) {
        return new Response(
            JSON.stringify({
                message: `Message successfully sent!`,
            }),
            {
                status: 200,
                statusText: "OK",
            },
        ); // If there was an error sending the message, return a 500 response
    } else {
        return new Response(
            JSON.stringify({
                message: `Message failed to send: ${sendResend.error?.message} ${sendResend.error?.name}`,
            }),
            {
                status: 500,
                statusText: `Internal Server Error: ${sendResend.error}`,
            },
        );
    }
};
