import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: "admin@rks-fachkraefte.de" },
    update: {},
    create: {
      email: "admin@rks-fachkraefte.de",
      passwordHash: adminHash,
      role: "ADMIN",
      isApproved: true,
      preferredLanguage: "de",
    },
  });

  console.log("Seed complete. Admin: admin@rks-fachkraefte.de / admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
