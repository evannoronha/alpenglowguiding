import { useState } from "react";
import Form from "react-bootstrap/Form";
import type { FormEvent } from "react";
import { Button } from "react-bootstrap";

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
            <h2 id="contact">Contact</h2>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="J. Smith" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPhone">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="tel" placeholder="Enter phone number" />
                </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicMessage">
                        <Form.Label>Message</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Enter message" />
                    </Form.Group>
                <Button variant="primary" type="submit">
                    Send
                </Button>
                {responseMessage && <p>{responseMessage}</p>}
            </Form>
        </>
    );
}
