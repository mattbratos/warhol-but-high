import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const response = await client.images.generate({
      model: "grok-2-image-gen",
      prompt,
      n: 3,
    });

    const images = (response.data ?? []).map((img) => img.url);

    return NextResponse.json({ images });
  } catch (error: unknown) {
    console.error("Image generation error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate images";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
