const Customer = require("../models/Customer");
const errorResponse = require("../utils/errorResponse");
const successResponse = require("../utils/successResponse");
const normalizePhone = (phone) => phone.replace(/\D/g, "");

exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, shippingAddress } = req.body;

    if (!name || !email) {
      return errorResponse(
        res,
        400,
        "MISSING_FIELDS",
        "Nombre y correo son obligatorios"
      );
    }

    const existing = await Customer.findOne({ email });
    if (existing) {
      return errorResponse(
        res,
        409,
        "CUSTOMER_EXISTS",
        "Ya existe un cliente con ese correo"
      );
    }

    const customer = new Customer({
      name,
      email,
      phone,
      shippingAddress,
    });

    await customer.save();

    return successResponse(res, 201, "Cliente creado con éxito");
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "ERROR", `Error interno del servidor}`);
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const normalizedSearch = normalizePhone(search);

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: normalizedSearch, $options: "i" } },
      ],
    };

    const [customers, total] = await Promise.all([
      Customer.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Customer.countDocuments(query),
    ]);

    return res.json({
      data: customers,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener clientes" });
  }
};

exports.getCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id);

    if (!customer) {
      return errorResponse(
        res,
        404,
        "CUSTOMER_NOT_FOUND",
        "Cliente no encontrado"
      );
    }

    return successResponse(res, 200, "Cliente encontrado", customer);
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      500,
      "INTERNAL_SERVER_ERROR",
      "Error interno del servidor"
    );
  }
};
