import express from "express";

import {
  createAttribute,
  getAttributes,
  updateAttribute,
  deleteAttribute,
} from "../controllers/serviceAttributeController.js";

const router = express.Router();

// Create an attribute for a service
router.post("/", createAttribute);

// Get all attributes for a specific service
router.get("/:serviceId", getAttributes);

// Update an attribute
router.put("/:id", updateAttribute);

// Delete an attribute
router.delete("/:id", deleteAttribute);

export default router;