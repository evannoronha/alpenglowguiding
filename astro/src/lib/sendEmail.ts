import { Resend } from 'resend';

export async function sendEmail(
  name: string,
  _email: string,
  htmlContent: string,
  fromEmail: string,
  toEmail: string,
  apiKey: string
) {
  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `Contact Form Submission from ${name}`,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend API error:', error);
      return new Response(
        JSON.stringify({
          message: 'Failed to send email',
          error: error,
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: 'Email sent successfully!',
        data,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({
        message: 'Failed to send email',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
