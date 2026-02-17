import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// GET /api/public/settings - Fetch site settings
export async function GET() {
  try {
    let settings = await db.settings.findUnique({
      where: { id: "site" },
    });

    // Create default settings if they don't exist
    if (!settings) {
      settings = await db.settings.create({
        data: {
          id: "site",
          siteName: "The Artificial Intelligencer",
          tagline: "AI-Powered Editorial Content",
          isPublic: true,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}
