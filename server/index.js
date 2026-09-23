import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import serviceAttributeRoutes from "./routes/serviceAttributeRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/service-attributes", serviceAttributeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/services", serviceRoutes);
app.get("/", (req, res) => {
  res.json({ message: "Buznissy API is running" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
