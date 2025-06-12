const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const ordersRoutes = require("./routes/ordersRoutes");
const customersRoutes = require("./routes/customerRoutes");
const integrationsRoutes = require("./routes/integrationsRoutes");
const errorHandler = require("./middlewares/errorHandler");

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/integrations", integrationsRoutes);

// Error handler
app.use(errorHandler);

// Conexión a Mongo y servidor
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, "0.0.0.0", () =>
      console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("Error de conexión a MongoDB:", err));
