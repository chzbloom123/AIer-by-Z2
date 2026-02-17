import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/public/article/[id] - Fetch single article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const article = await db.article.findUnique({
      where: { id },
      include: {
        persona: {
          select: {
            id: true,
            name: true,
            bio: true,
            role: true,
            profileImageUrl: true,
          },
        },
      },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (!article.isPublic) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}
