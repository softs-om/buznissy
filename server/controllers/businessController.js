import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createBusiness = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      businessType,
      industry,
      phone,
      whatsapp,
      email,
      website,
      instagram,
      tiktok,
      snapchat,
      youtube,
      address,
      city,
      country,
      category,
    } = req.body;

    const logo = req.files?.logo?.[0]?.path || null;
    const coverImage = req.files?.coverImage?.[0]?.path || null;

    const business = await prisma.business.create({
      data: {
        name,
        slug,
        description,
        businessType,
        industry,
        logo,
        coverImage,
        phone,
        whatsapp,
        email,
        website,
        instagram,
        tiktok,
        snapchat,
        youtube,
        address,
        city,
        country,
        category,
        userId: req.user.userId,
      },
    });

    res.status(201).json(business);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyBusinesses = async (req, res) => {
  try {
    const businesses = await prisma.business.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBusinessById = async (req, res) => {
  try {
    const business = await prisma.business.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    });

    if (!business) {
      return res.status(404).json({
        message: "Business not found",
      });
    }

    res.json(business);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    const business = await prisma.business.findUnique({
      where: { id },
    });

    if (!business) {
      return res.status(404).json({
        message: "Business not found",
      });
    }

    if (business.userId !== req.user.userId) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const {
      name,
      description,
      category,
      phone,
      whatsapp,
      email,
      website,
      instagram,
      tiktok,
      snapchat,
      youtube,
      address,
      city,
      country,
    } = req.body;
    const logo = req.files?.logo?.[0]?.path;
    const coverImage = req.files?.coverImage?.[0]?.path;

    const updatedBusiness = await prisma.business.update({
      where: { id },
      data: {
        name,
        description,
        category,
        phone,
        whatsapp,
        email,
        website,
        instagram,
        tiktok,
        snapchat,
        youtube,
        address,
        city,
        country,

        ...(logo && { logo }),
        ...(coverImage && { coverImage }),
      },
    });

    res.json(updatedBusiness);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    const business = await prisma.business.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!business) {
      return res.status(404).json({
        message: "Business not found",
      });
    }

    await prisma.business.delete({
      where: { id },
    });

    res.json({
      message: "Business deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
