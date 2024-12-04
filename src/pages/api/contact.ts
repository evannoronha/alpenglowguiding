import type { APIRoute } from "astro";

export const prerender = false

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

    return new Response(
        JSON.stringify({
          message: "Success!"
        }),
        { status: 200 }
    );
};
