import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

interface ISendEmail {
    email: string;
    html: string;
    subject: string;
    name: string;
  }

  async function sendEmail(props: ISendEmail) {
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_SOURCE,
        pass: process.env.EMAIL_PASS,
      },
    } as SMTPTransport.Options);

    let message = {
      from: process.env.EMAIL,
      replyTo: props.email,
      to: process.env.EMAIL_DESTINATION,
      subject: props.subject,
      name: props.name,
      html: `<h1>Contact Form</h1><br>
      <b>Name</b>: ${props.name}<br>
      <b>Email</b>: ${props.email}<br>
      <b>Message</b>: ${props.html}`,
    };

    let info = await transporter.sendMail(message);
    return info;
  }

  export { sendEmail };
