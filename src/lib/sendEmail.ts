import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (name: string, email: string, htmlContent: string) => {
    const sendResend = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL as string,
        replyTo: email as string,
        to: process.env.RESEND_TO_EMAIL as string,
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
