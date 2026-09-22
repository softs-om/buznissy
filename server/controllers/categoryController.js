import prisma from "../lib/prisma.js";

// Create category
export const createCategory = async (req, res) => {
  try {
    const { name, description, businessId } = req.body;

    if (!name || !businessId) {
      return res.status(400).json({
        message: "Name and businessId are required",
      });
    }

    // Make sure this business belongs to the logged-in user
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        userId: req.user.id,
      },
    });

    if (!business) {
      return res.status(404).json({
        message: "Business not found",
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        businessId,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create category" });
  }
};

// Get categories for a business
export const getCategories = async (req, res) => {
  try {
    const { businessId } = req.params;

    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        userId: req.user.id,
      },
    });

    if (!business) {
      return res.status(404).json({
        message: "Business not found",
      });
    }

    const categories = await prisma.category.findMany({
      where: { businessId },
      include: {
        services: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get categories" });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const existing = await prisma.category.findFirst({
      where: {
        id,
        business: {
          userId: req.user.id,
        },
      },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
      },
    });

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update category" });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.category.findFirst({
      where: {
        id,
        business: {
          userId: req.user.id,
        },
      },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    await prisma.category.delete({
      where: { id },
    });

    res.json({ message: "Category deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete category" });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findFirst({
      where: {
        id,
        business: {
          userId: req.user.id,
        },
      },
      include: {
        services: {
          include: {
            attributes: true,
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json(category);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get category",
    });
  }
};
