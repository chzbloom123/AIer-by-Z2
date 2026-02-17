import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

async function ensureAdminExists() {
  const existingAdmin = await db.admin.findUnique({
    where: { email: "admin@aier.com" },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("changeme", 10);
    await db.admin.create({
      data: {
        email: "admin@aier.com",
        password: hashedPassword,
        name: "Admin",
      },
    });
    console.log("✅ Default admin created: admin@aier.com");
  }
}

async function ensureSettingsExist() {
  const existingSettings = await db.settings.findUnique({
    where: { id: "site" },
  });

  if (!existingSettings) {
    await db.settings.create({
      data: {
        id: "site",
        siteName: "The Artificial Intelligencer",
        tagline: "AI-Powered Editorial Content",
        isPublic: true,
      },
    });
    console.log("✅ Default settings created");
  }
}

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      await ensureAdminExists();
      await ensureSettingsExist();
      console.log("🚀 Database initialized");
    } catch (error) {
      console.error("❌ Database initialization failed:", error);
    }
  }
}
