const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const csv = require("csv-parser");
const streamifier = require("streamifier");

exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status, from, to } = req.query;

    const query = { user: userId };

    if (status) {
      query.status = status.toUpperCase();
    }

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
    const userId = req.user.id;
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, user: userId })
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
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "Archivo no proporcionado" });
    }

    const stream = req.file.buffer.toString("utf8");
    const ordersMap = new Map();

    streamifier
      .createReadStream(stream)
      .pipe(csv())
      .on("data", (row) => {
        const txId = row.transactionId;

        if (!ordersMap.has(txId)) {
          ordersMap.set(txId, {
            transactionId: txId,
            user: userId,
            customer: row.customerId,
            items: [],
            status: row.status?.toUpperCase(),
            subtotal: parseFloat(row.subtotal || 0),
            shippingCost: parseFloat(row.shippingCost || 0),
            tax: parseFloat(row.tax || 0),
            total: parseFloat(row.total || 0),
            shippingAddress: {
              street: row.shippingStreet,
              city: row.shippingCity,
              state: row.shippingState,
              postalCode: row.shippingPostalCode,
              country: row.shippingCountry,
            },
            billingAddress: {
              sameAsShipping: row.sameAsShipping?.toLowerCase() === "true",
            },
            note: row.note,
            createdAt: row.createdAt ? new Date(row.createdAt) : new Date(),
          });
        }

        // Agregar ítem
        const order = ordersMap.get(txId);
        order.items.push({
          product: row.productId,
          quantity: parseInt(row.quantity),
          unitPrice: parseFloat(row.unitPrice),
        });
      })
      .on("end", async () => {
        const finalOrders = Array.from(ordersMap.values());

        if (finalOrders.length === 0) {
          return res.status(400).json({ message: "CSV vacío o mal formado" });
        }

        await Order.insertMany(finalOrders);
        res.status(201).json({
          message: "Órdenes importadas correctamente",
          inserted: finalOrders.length,
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al importar CSV" });
  }
};
