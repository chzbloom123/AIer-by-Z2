import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/public/persona/[id] - Fetch single persona with their articles
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const persona = await db.persona.findUnique({
      where: { id },
    });

    if (!persona || !persona.isActive) {
      return NextResponse.json({ error: "Persona not found" }, { status: 404 });
    }

    // Fetch articles by this persona
    const articles = await db.article.findMany({
      where: {
        personaId: id,
        isPublic: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        excerpt: true,
        featuredImageUrl: true,
        category: true,
        publishedAt: true,
      },
    });

    return NextResponse.json({ persona, articles });
  } catch (error) {
    console.error("Error fetching persona:", error);
    return NextResponse.json(
      { error: "Failed to fetch persona" },
      { status: 500 }
    );
  }
}
