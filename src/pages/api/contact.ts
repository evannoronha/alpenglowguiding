import type { APIRoute } from "astro";
import { sendEmail } from "../../lib/sendEmail";

export const prerender = false
const emailRecipient = process.env.EMAIL_DESTINATION;

export const POST: APIRoute = async ({ request }) => {
    const data = await request.formData();

    const name = data.get("name");
    const email = data.get("email");
    const phoneNumber = data.get("phone");
    const message = data.get("message");

    if (!name || !email || !message || !phoneNumber) {
        return new Response(
          JSON.stringify({
            message: "Missing required fields",
          }),
          { status: 400 }
        );
      }

    sendEmail({
        email: email as string,
        html: message as string,
        subject: "New Contact Form Submission",
        name: name as string,
    });
    return new Response(
        JSON.stringify({
          message: "Success!"
        }),
        { status: 200 }
    );
};
