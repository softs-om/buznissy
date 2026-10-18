import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  reserveSubdomain,
  getBusinessDomains,
} from "../controllers/domainController.js";

const router = express.Router();

router.post("/:businessId/reserve", protect, reserveSubdomain);
router.get("/:businessId", protect, getBusinessDomains);

export default router;
