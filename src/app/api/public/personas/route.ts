import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// GET /api/public/personas - Fetch active personas
export async function GET() {
  try {
    const personas = await db.persona.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    return NextResponse.json(personas);
  } catch (error) {
    console.error("Error fetching personas:", error);
    return NextResponse.json(
      { error: "Failed to fetch personas" },
      { status: 500 }
    );
  }
}
