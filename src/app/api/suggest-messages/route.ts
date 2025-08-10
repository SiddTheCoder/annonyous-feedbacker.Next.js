import { NextResponse } from "next/server";
import { Mistral } from "@mistralai/mistralai";

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY!, // put in .env.local
  // If you want to use OpenRouter instead of Mistral’s own endpoint:
  // server: "https://openrouter.ai/api/v1",
});

export async function GET() {
  console.log("Generating messages...", process.env.MISTRAL_API_KEY);
  try {
    const prompt = `
      Generate exactly 3 short, unique, and thoughtful anonymous messages.
      Output them as plain text with each message on its own line. 
      Do not use numbering, bullet points, or quotation marks.
      `;
    const completion = await client.chat.complete({
      model: "mistral-large-latest", // or mistral-small-latest / mistral-7b-instruct
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      maxTokens: 150,
    });

    const rawContent = completion.choices[0]?.message?.content ?? "";

    // Normalize to string
    const rawText =
      typeof rawContent === "string"
        ? rawContent
        : rawContent
            .filter((chunk) => chunk.type === "text")
            .map((chunk) => (chunk as { type: "text"; text: string }).text)
            .join(" ");

    const messages = rawText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    return NextResponse.json({ messages });
  } catch (err) {
    console.error("Error generating messages:", err);
    return NextResponse.json(
      { error: "Failed to generate messages" },
      { status: 500 }
    );
  }
}
