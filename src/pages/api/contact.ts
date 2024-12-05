export const prerender = false; //This will not work without this line

import type { APIRoute } from "astro";
import { sendEmail } from "../../lib/sendEmail";

export const POST: APIRoute = async (context) => {
  let request = context.request
  // @ts-ignore
  let { RESEND_FROM_EMAIL, RESEND_TO_EMAIL, RESEND_API_KEY } = context.locals.runtime.env

  const data = await request.formData();
  const name = data.get("name") as string;
  const email = data.get("email") as string;
  const message = data.get("message"); // Validate the data - making sure values are not empty
  const phone = data.get("phone");

  if (!name || !email || !message || !phone) {
    return new Response(
      JSON.stringify({
        message: `Fill out all fields.`,
      }),
      {
        status: 404,
        statusText: "Did not provide the right data",
      },
    );
  }

  // Send the message to the email address
  let htmlContent = `
  <h1>Contact Form Submission</h1>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Phone:</strong> ${phone}</p>
  <p><strong>Message:</strong> ${message}</p>`;

  return sendEmail(name, email, htmlContent, RESEND_FROM_EMAIL, RESEND_TO_EMAIL, RESEND_API_KEY);
}
