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
  const message = data.get("message") as string;
  const phone = data.get("phone") as string;
  const inquiryType = data.get("inquiryType") as string;
  const tripDetails = data.get("tripDetails") as string;

  if (!name || !email || !message || !phone || !inquiryType) {
    return new Response(
      JSON.stringify({
        message: `Fill out all required fields.`,
      }),
      {
        status: 400,
        statusText: "Did not provide the right data",
      },
    );
  }

  // Send the message to the email address
  let htmlContent = `
  <h1>Contact Form Submission</h1>
  <p><strong>Inquiry Type:</strong> ${inquiryType === 'booking' ? 'Trip Booking Request' : 'General Question'}</p>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Phone:</strong> ${phone}</p>
  ${inquiryType === 'booking' && tripDetails ? `<p><strong>Trip Details:</strong> ${tripDetails}</p>` : ''}
  <p><strong>Message:</strong> ${message}</p>`;

  return sendEmail(name, email, htmlContent, RESEND_FROM_EMAIL, RESEND_TO_EMAIL, RESEND_API_KEY);
}
