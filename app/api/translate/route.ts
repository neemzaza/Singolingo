// @ts-ignore
import { translate } from "google-translate-api-browser"

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text) {
      return new Response(
        JSON.stringify({
          error: "Missing text"
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const result = await translate(text, { to: "th" });

    return new Response(JSON.stringify({
      text: result.text
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
  });

  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error: 'Translation failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}