import "dotenv/config";
import prisma from "../lib/prisma.js";

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();

if (!email) {
  console.error("Set ADMIN_EMAIL before running this script.");
  process.exitCode = 1;
} else {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
      },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      throw new Error("Register this account first.");
    }

    const existingAdmins = await prisma.user.count({
      where: { role: "ADMIN", id: { not: user.id } },
    });

    if (existingAdmins > 0) {
      throw new Error("Another administrator exists. Review roles manually.");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { role: "ADMIN" },
    });

    console.log(`Administrator assigned: ${user.email}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

await prisma.$disconnect();
