import express from "express";
import { getOrders, updateOrder } from "../controllers/orderController.js";

const router = express.Router();

router.get("/", getOrders);
router.patch("/:id", updateOrder);

export default router;
