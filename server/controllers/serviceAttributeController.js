import prisma from "../lib/prisma.js";

// Create attribute
export const createAttribute = async (req, res) => {
  try {
    const {
      serviceId,
      name,
      type,
      required,
      options,
      minValue,
      maxValue,
      placeholder,
    } = req.body;

    const attribute = await prisma.serviceAttribute.create({
      data: {
        serviceId,
        name,
        type,
        required,
        options,
        minValue,
        maxValue,
        placeholder,
      },
    });

    res.status(201).json(attribute);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create attribute" });
  }
};

// Get all attributes for one service
export const getAttributes = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const attributes = await prisma.serviceAttribute.findMany({
      where: { serviceId },
      orderBy: { createdAt: "asc" },
    });

    res.json(attributes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch attributes" });
  }
};

// Update attribute
export const updateAttribute = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      type,
      required,
      options,
      minValue,
      maxValue,
      placeholder,
    } = req.body;

    const attribute = await prisma.serviceAttribute.update({
      where: { id },
      data: {
        name,
        type,
        required,
        options,
        minValue,
        maxValue,
        placeholder,
      },
    });

    res.json(attribute);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update attribute" });
  }
};

// Delete attribute
export const deleteAttribute = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.serviceAttribute.delete({
      where: { id },
    });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete attribute" });
  }
};