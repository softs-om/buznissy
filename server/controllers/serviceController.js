import prisma from "../lib/prisma.js";

// Create service/product/booking/package
export const createService = async (req, res) => {
  try {
    const {
      title,
      description,
      serviceType,
      price,
      categoryId,
    } = req.body;

    if (!title || !serviceType || !categoryId) {
      return res.status(400).json({
        message: "title, serviceType and categoryId are required",
      });
    }

    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        business: {
          userId: req.user.id,
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const service = await prisma.service.create({
      data: {
        title,
        description,
        serviceType,
        price:
          price !== undefined && price !== null
            ? Number(price)
            : null,
        categoryId,
      },
      include: {
        attributes: true,
      },
    });

    res.status(201).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create service" });
  }
};

// Get services inside a category
export const getServices = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        business: {
          userId: req.user.id,
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const services = await prisma.service.findMany({
      where: { categoryId },
      include: {
        attributes: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get services" });
  }
};

// Update service
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      serviceType,
      price,
    } = req.body;

    const existing = await prisma.service.findFirst({
      where: {
        id,
        category: {
          business: {
            userId: req.user.id,
          },
        },
      },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(serviceType !== undefined && { serviceType }),
        ...(price !== undefined && {
          price: price === null ? null : Number(price),
        }),
      },
      include: {
        attributes: true,
      },
    });

    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update service" });
  }
};

// Delete service
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.service.findFirst({
      where: {
        id,
        category: {
          business: {
            userId: req.user.id,
          },
        },
      },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    await prisma.service.delete({
      where: { id },
    });

    res.json({ message: "Service deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete service" });
  }
};