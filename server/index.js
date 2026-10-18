import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import serviceAttributeRoutes from "./routes/serviceAttributeRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import domainRoutes from "./routes/domainRoutes.js";
import { expireSubscriptions } from "./services/subscriptionMaintenance.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Buznissy API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/service-attributes", serviceAttributeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/domains", domainRoutes);

const PORT = process.env.PORT || 5001;

const runSubscriptionMaintenance = async () => {
  try {
    const expired = await expireSubscriptions();

    if (expired > 0) {
      console.log(`Expired subscriptions: ${expired}`);
    }
  } catch (error) {
    console.error("Subscription maintenance failed:", error);
  }
};

runSubscriptionMaintenance();

setInterval(runSubscriptionMaintenance, 60 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
