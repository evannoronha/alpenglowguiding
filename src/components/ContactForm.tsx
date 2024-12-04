import { useState } from "react";
import type { FormEvent } from "react";
import './ContactForm.css'

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
            <form method="POST" onSubmit={submit}>
                <label>
                    Email
                    <input type="email" name="email" />
                </label>
                <label>
                    Name
                    <input type="text" name="name" />
                </label>
                <label>
                    Phone Number
                    <input type="tel" name="phone" />
                </label>
                <label>
                    Message
                    <textarea name="message"></textarea>
                </label>
                <button type="submit">Send</button>
                {responseMessage && <p>{responseMessage}</p>}
            </form>
        </>
    );
}
