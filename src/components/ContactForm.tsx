import { useState } from "react";
import type { FormEvent } from "react";
import '../styles/ContactForm.css'

export default function ContactForm() {
    const [responseMessage, setResponseMessage] = useState("");

    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const response = await fetch("/api/contact", {
            method: "POST",
            body: formData,
        });
        interface ResponseData {
            message?: string;
        }
        const data: ResponseData = await response.json();
        if (data.message) {
            setResponseMessage(data.message);
        }
    }

    return(
        <>
            <h2>Contact</h2>
            <form method="POST" onSubmit={submit}>
                <label>
                    Email
                    <input type="email" name="email" required={true} />
                </label>
                <label>
                    Name
                    <input type="text" name="name" required={true} />
                </label>
                <label>
                    Phone Number
                    <input type="tel" name="phone" required={true} />
                </label>
                <label>
                    Message
                    <textarea name="message" required={true}></textarea>
                </label>
                <button type="submit">Send</button>
                {responseMessage && <p>{responseMessage}</p>}
            </form>
        </>
    );
}
