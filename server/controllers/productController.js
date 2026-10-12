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

export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const products = await prisma.product.findMany({
      where: {
        categoryId,
        business: {
          userId: req.user.id,
        },
      },
      include: {
        media: true,
        variants: true,
        guides: true,
        customFields: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      message: "Failed to get products",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;

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

    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        business: {
          userId: req.user.id,
        },
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (categoryId) {
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
    }

    const product = await prisma.$transaction(async (tx) => {
      await tx.productMedia.deleteMany({
        where: { productId },
      });

      await tx.productVariant.deleteMany({
        where: { productId },
      });

      await tx.productGuide.deleteMany({
        where: { productId },
      });

      await tx.productCustomField.deleteMany({
        where: { productId },
      });

      return tx.product.update({
        where: { id: productId },

        data: {
          title,
          description,

          basePrice:
            basePrice === "" || basePrice === null || basePrice === undefined
              ? null
              : Number(basePrice),

          stock:
            stock === "" || stock === null || stock === undefined
              ? null
              : Number(stock),

          estimatedDelivery: estimatedDelivery || null,

          discount:
            discount === "" || discount === null || discount === undefined
              ? null
              : Number(discount),

          categoryId,

          media: {
            create: media
              .filter((item) => item.url)
              .map((item) => ({
                url: item.url,
                type: item.type || "IMAGE",
              })),
          },

          variants: {
            create: variants
              .filter((item) => item.name && item.value)
              .map((item) => ({
                name: item.name,
                value: item.value,

                price:
                  item.price === "" || item.price == null
                    ? null
                    : Number(item.price),

                stock:
                  item.stock === "" || item.stock == null
                    ? null
                    : Number(item.stock),

                image: item.image || null,
              })),
          },

          guides: {
            create: guides
              .filter((item) => item.title && item.image)
              .map((item) => ({
                title: item.title,
                image: item.image,
              })),
          },

          customFields: {
            create: customFields
              .filter((item) => item.title && item.value)
              .map((item) => ({
                title: item.title,
                value: item.value,
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
    });

    res.json(product);
  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({
      message: "Failed to update product",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        business: {
          userId: req.user.id,
        },
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      message: "Failed to delete product",
    });
  }
};
