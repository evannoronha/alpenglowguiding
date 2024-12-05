export const prerender = false; //This will not work without this line

import type { APIRoute } from "astro";
import { sendEmail } from "../../lib/sendEmail";

// Instantiate Resend with api key in .env called RESEND_API_KEY

export const POST: APIRoute = async ({ request }) => {
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

  return sendEmail(name, email, htmlContent);
}
