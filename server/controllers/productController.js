import prisma from "../lib/prisma.js";

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      basePrice,
      stock,
      estimatedDelivery,
      discount,
      categoryId,
      media = [],
      variants = [],
      guides = [],
      customFields = [],
    } = req.body;

    if (!title || !categoryId) {
      return res.status(400).json({
        message: "title and categoryId are required",
      });
    }

    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        business: {
          userId: req.user.id,
          businessType: "TRADER",
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        message: "Trader category not found",
      });
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,

        basePrice:
          basePrice !== undefined && basePrice !== ""
            ? Number(basePrice)
            : null,

        stock: stock !== undefined && stock !== "" ? Number(stock) : null,

        estimatedDelivery: estimatedDelivery || null,

        discount:
          discount !== undefined && discount !== "" ? Number(discount) : null,

        categoryId,
        businessId: category.businessId,

        media: {
          create: media.map((item) => ({
            url: item.url,
            type: item.type,
          })),
        },

        variants: {
          create: variants.map((variant) => ({
            name: variant.name,
            value: variant.value,
            price:
              variant.price !== undefined && variant.price !== ""
                ? Number(variant.price)
                : null,
            stock:
              variant.stock !== undefined && variant.stock !== ""
                ? Number(variant.stock)
                : null,
            image: variant.image || null,
          })),
        },

        guides: {
          create: guides.map((guide) => ({
            title: guide.title || null,
            image: guide.image,
          })),
        },

        customFields: {
          create: customFields.map((field) => ({
            title: field.title,
            value: field.value,
          })),
        },
      },

      include: {
        media: true,
        variants: true,
        guides: true,
        customFields: true,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);

    res.status(500).json({
      message: "Failed to create product",
    });
  }
};
