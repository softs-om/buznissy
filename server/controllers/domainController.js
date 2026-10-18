import { PrismaClient } from "@prisma/client";
import { reserveBusinessSubdomain } from "../services/domainService.js";

const prisma = new PrismaClient();

export const reserveSubdomain = async (req, res) => {
  try {
    const businessId = req.params.businessId;

    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        userId: req.user.userId,
      },
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const domain = await reserveBusinessSubdomain(
      prisma,
      business.id,
      business.name,
    );

    return res.json({
      message: "Subdomain reserved",
      domain,
    });
  } catch (error) {
    console.error("Domain reservation failed:", error);
    return res.status(500).json({
      message: "Could not reserve subdomain",
    });
  }
};

export const getBusinessDomains = async (req, res) => {
  try {
    const { businessId } = req.params;

    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        userId: req.user.userId,
      },
    });

    if (!business) {
      return res.status(404).json({
        message: "Business not found",
      });
    }

    const subdomain = await reserveBusinessSubdomain(
      prisma,
      business.id,
      business.name,
    );

    const domains = await prisma.domain.findMany({
      where: { businessId },
      orderBy: { createdAt: "asc" },
    });

    return res.json({
      subdomain,
      domains,
    });
  } catch (error) {
    console.error("Could not load domains:", error);

    return res.status(500).json({
      message: "Could not load business domains",
    });
  }
};
