import express from "express";
import {
  getOrders,
  createOrder,
  updateOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/", getOrders);
router.patch("/:id", updateOrder);
router.post("/", createOrder);

export default router;
