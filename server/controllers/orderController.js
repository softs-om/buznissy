import prisma from "../lib/prisma.js";

export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load orders." });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update order." });
  }
};
