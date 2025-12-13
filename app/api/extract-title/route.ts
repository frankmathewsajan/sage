import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Fetch the webpage
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch URL" }, { status: 400 });
    }

    const html = await response.text();

    // Extract title from HTML
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "";

    // Clean up LeetCode title (remove " - LeetCode" suffix)
    const cleanTitle = title.replace(/\s*-\s*LeetCode.*$/i, "").trim();

    return NextResponse.json({ title: cleanTitle });
  } catch (error) {
    console.error("Error extracting title:", error);
    return NextResponse.json(
      { error: "Failed to extract title" },
      { status: 500 }
    );
  }
}
