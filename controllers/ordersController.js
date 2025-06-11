const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const csv = require("csv-parser");

exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, from, to } = req.query;

    const query = {};

    // Filtro por status
    if (status) {
      query.status = status.toUpperCase();
    }

    // Filtro por fechas
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(query),
    ]);

    res.json({
      data: orders,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener órdenes" });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("customer", "name email phone")
      .populate("items.product", "name price imageUrl sku")
      .lean();

    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener la orden" });
  }
};

exports.uploadOrdersCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Archivo no proporcionado" });
    }

    const results = [];

    const stream = req.file.buffer.toString("utf8");

    require("streamifier")
      .createReadStream(stream)
      .pipe(csv())
      .on("data", (row) => {
        if (
          row.transactionId &&
          row.from &&
          row.to &&
          row.amount &&
          row.status &&
          row.createdAt
        ) {
          results.push({
            transactionId: row.transactionId,
            from: row.from,
            to: row.to,
            amount: parseFloat(row.amount),
            status: row.status.toUpperCase(),
            createdAt: new Date(row.createdAt),
          });
        }
      })
      .on("end", async () => {
        if (results.length === 0) {
          return res.status(400).json({ message: "CSV vacío o inválido" });
        }

        await Order.insertMany(results);
        res.status(201).json({
          message: "Órdenes importadas correctamente",
          inserted: results.length,
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al importar CSV" });
  }
};
