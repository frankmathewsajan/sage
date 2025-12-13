import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Extract problem slug from URL
    const slugMatch = url.match(/\/problems\/([^\/\?]+)/);
    if (!slugMatch) {
      return NextResponse.json({ error: "Invalid LeetCode URL" }, { status: 400 });
    }
    const slug = slugMatch[1];

    // Use LeetCode's GraphQL API for instant metadata extraction
    const graphqlQuery = {
      query: `
        query getQuestionDetail($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            questionId
            title
            difficulty
            topicTags {
              name
            }
            content
          }
        }
      `,
      variables: { titleSlug: slug },
    };

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
      },
      body: JSON.stringify(graphqlQuery),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch from LeetCode API" }, { status: 400 });
    }

    const data = await response.json();
    const question = data?.data?.question;

    if (!question) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Extract description preview (first paragraph)
    const descriptionMatch = question.content?.match(/<p>([^<]+)<\/p>/);
    const description = descriptionMatch ? descriptionMatch[1].trim().substring(0, 200) : "";

    // Get top patterns/topics
    const patterns = question.topicTags?.slice(0, 3).map((tag: any) => tag.name).join(", ") || "";

    return NextResponse.json({
      title: `${question.questionId}. ${question.title}`,
      difficulty: question.difficulty,
      patterns,
      description,
    });
  } catch (error) {
    console.error("Error extracting title:", error);
    return NextResponse.json(
      { error: "Failed to extract title" },
      { status: 500 }
    );
  }
}
