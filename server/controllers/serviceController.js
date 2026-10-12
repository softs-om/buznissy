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

      // Specialized service information
      duration,
      durationUnit,
      location,
      conditions,
      sampleLink,
      advertisementType,
      discount,

      // Related information
      media = [],
      addOns = [],
      timeSlots = [],
      customFields = [],
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
      include: {
        business: true,
      },
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Traders create products, not services
    if (category.business.businessType === "TRADER") {
      return res.status(400).json({
        message: "Trader businesses must create products.",
      });
    }

    const service = await prisma.service.create({
      data: {
        title,
        description,
        serviceType,
        categoryId,
        durationUnit: durationUnit || "minutes",
        price:
          price !== undefined && price !== null && price !== ""
            ? Number(price)
            : null,

        duration:
          duration !== undefined && duration !== null && duration !== ""
            ? Number(duration)
            : null,

        location: location || null,
        conditions: conditions || null,
        sampleLink: sampleLink || null,

        // Mainly for influencer services
        advertisementType:
          category.business.businessType === "INFLUENCER"
            ? advertisementType || null
            : null,

        discount:
          discount !== undefined && discount !== null && discount !== ""
            ? Number(discount)
            : null,

        media: {
          create: media.map((item) => ({
            url: item.url,
            type: item.type,
          })),
        },

        addOns: {
          create: addOns.map((item) => ({
            name: item.name,
            price: Number(item.price || 0),
          })),
        },

        timeSlots: {
          create: timeSlots.map((slot) => ({
            startTime: new Date(slot.startTime),
            endTime: slot.endTime ? new Date(slot.endTime) : null,
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
        attributes: true,
        media: true,
        addOns: true,
        timeSlots: true,
        customFields: true,
      },
    });

    res.status(201).json(service);
  } catch (error) {
    console.error("Create service error:", error);

    res.status(500).json({
      message: "Failed to create service",
    });
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
        media: true,
        addOns: true,
        timeSlots: true,
        customFields: true,
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

    const {
      title,
      description,
      serviceType,
      price,
      duration,
      durationUnit,
      location,
      conditions,
      sampleLink,
      advertisementType,
      discount,
      categoryId,
      media = [],
      addOns = [],
      timeSlots = [],
      customFields = [],
    } = req.body;

    const service = await prisma.$transaction(async (tx) => {
      await tx.serviceMedia.deleteMany({
        where: { serviceId: id },
      });

      await tx.serviceAddOn.deleteMany({
        where: { serviceId: id },
      });

      await tx.serviceTimeSlot.deleteMany({
        where: { serviceId: id },
      });

      await tx.serviceCustomField.deleteMany({
        where: { serviceId: id },
      });

      return tx.service.update({
        where: { id },

        data: {
          title,
          description,
          serviceType,
          durationUnit: durationUnit || "minutes",
          price:
            price === "" || price === null || price === undefined
              ? null
              : Number(price),

          duration:
            duration === "" || duration === null || duration === undefined
              ? null
              : Number(duration),

          location: location || null,
          conditions: conditions || null,
          sampleLink: sampleLink || null,

          advertisementType: advertisementType || null,

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

          addOns: {
            create: addOns
              .filter((item) => item.name)
              .map((item) => ({
                name: item.name,
                price: Number(item.price || 0),
              })),
          },

          timeSlots: {
            create: timeSlots
              .filter((slot) => slot.startTime)
              .map((slot) => ({
                startTime: new Date(slot.startTime),

                endTime: slot.endTime ? new Date(slot.endTime) : null,
              })),
          },

          customFields: {
            create: customFields
              .filter((field) => field.title && field.value)
              .map((field) => ({
                title: field.title,
                value: field.value,
              })),
          },
        },

        include: {
          attributes: true,
          media: true,
          addOns: true,
          timeSlots: true,
          customFields: true,
        },
      });
    });

    res.json(service);
  } catch (error) {
    console.error("Update service error:", error);

    res.status(500).json({
      message: "Failed to update service",
    });
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
