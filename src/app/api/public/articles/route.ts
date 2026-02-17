import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/public/articles - Fetch public articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const personaId = searchParams.get("personaId");

    const where: {
      isPublic: boolean;
      category?: string;
      personaId?: string;
      OR?: Array<{
        title?: { contains: string };
        excerpt?: { contains: string };
        body?: { contains: string };
      }>;
    } = {
      isPublic: true,
    };

    if (category) {
      where.category = category;
    }

    if (personaId) {
      where.personaId = personaId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { body: { contains: search } },
      ];
    }

    const articles = await db.article.findMany({
      where,
      orderBy: {
        publishedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        excerpt: true,
        featuredImageUrl: true,
        personaId: true,
        personaName: true,
        category: true,
        publishedAt: true,
      },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
