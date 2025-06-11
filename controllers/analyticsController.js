const Order = require("../models/Order");
const dayjs = require("dayjs");

exports.getNetIncome = async (req, res) => {
  try {
    const from =
      req.query.from || dayjs().subtract(7, "day").startOf("day").toISOString();
    const to = req.query.to || dayjs().endOf("day").toISOString();

    const fromDate = new Date(from);
    const toDate = new Date(to);
    const duration = toDate.getTime() - fromDate.getTime();

    const prevFrom = new Date(fromDate.getTime() - duration);
    const prevTo = fromDate;

    const currentOrders = await Order.find({
      status: "COMPLETED",
      createdAt: { $gte: fromDate, $lte: toDate },
    });

    const currentTotal = currentOrders.reduce(
      (sum, order) => sum + Math.abs(order.amount),
      0
    );

    const previousOrders = await Order.find({
      status: "COMPLETED",
      createdAt: { $gte: prevFrom, $lte: prevTo },
    });

    const previousTotal = previousOrders.reduce(
      (sum, order) => sum + Math.abs(order.amount),
      0
    );

    const percentageChange =
      previousTotal === 0
        ? null
        : ((currentTotal - previousTotal) / previousTotal) * 100;

    res.json({
      total: currentTotal,
      percentageChange: percentageChange?.toFixed(2) ?? null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al calcular net income" });
  }
};

exports.getTotalOrders = async (req, res) => {
  try {
    const from =
      req.query.from || dayjs().subtract(7, "day").startOf("day").toISOString();
    const to = req.query.to || dayjs().endOf("day").toISOString();

    const fromDate = new Date(from);
    const toDate = new Date(to);
    const duration = toDate.getTime() - fromDate.getTime();

    const prevFrom = new Date(fromDate.getTime() - duration);
    const prevTo = fromDate;

    const currentCount = await Order.countDocuments({
      createdAt: { $gte: fromDate, $lte: toDate },
    });

    const previousCount = await Order.countDocuments({
      createdAt: { $gte: prevFrom, $lte: prevTo },
    });

    const percentageChange =
      previousCount === 0
        ? null
        : ((currentCount - previousCount) / previousCount) * 100;

    res.json({
      total: currentCount,
      percentageChange: percentageChange?.toFixed(2) ?? null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al calcular total de órdenes" });
  }
};

exports.getAverageSales = async (req, res) => {
  try {
    const from =
      req.query.from || dayjs().subtract(7, "day").startOf("day").toISOString();
    const to = req.query.to || dayjs().endOf("day").toISOString();

    const fromDate = new Date(from);
    const toDate = new Date(to);
    const duration = toDate.getTime() - fromDate.getTime();

    const prevFrom = new Date(fromDate.getTime() - duration);
    const prevTo = fromDate;

    // Actual
    const currentOrders = await Order.find({
      status: "COMPLETED",
      createdAt: { $gte: fromDate, $lte: toDate },
    });

    const currentTotal = currentOrders.reduce(
      (sum, order) => sum + Math.abs(order.amount),
      0
    );
    const currentCount = currentOrders.length;
    const currentAverage = currentCount === 0 ? 0 : currentTotal / currentCount;

    // Anterior
    const previousOrders = await Order.find({
      status: "COMPLETED",
      createdAt: { $gte: prevFrom, $lte: prevTo },
    });

    const previousTotal = previousOrders.reduce(
      (sum, order) => sum + Math.abs(order.amount),
      0
    );
    const previousCount = previousOrders.length;
    const previousAverage =
      previousCount === 0 ? 0 : previousTotal / previousCount;

    // Variación
    const percentageChange =
      previousAverage === 0
        ? null
        : ((currentAverage - previousAverage) / previousAverage) * 100;

    res.json({
      average: Number(currentAverage.toFixed(2)),
      percentageChange: percentageChange?.toFixed(2) ?? null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al calcular average sales" });
  }
};

exports.getCanceledOrders = async (req, res) => {
  try {
    const from =
      req.query.from || dayjs().subtract(7, "day").startOf("day").toISOString();
    const to = req.query.to || dayjs().endOf("day").toISOString();

    const fromDate = new Date(from);
    const toDate = new Date(to);
    const duration = toDate.getTime() - fromDate.getTime();

    const prevFrom = new Date(fromDate.getTime() - duration);
    const prevTo = fromDate;

    const currentCount = await Order.countDocuments({
      status: "CANCELED",
      createdAt: { $gte: fromDate, $lte: toDate },
    });

    const previousCount = await Order.countDocuments({
      status: "CANCELED",
      createdAt: { $gte: prevFrom, $lte: prevTo },
    });

    const percentageChange =
      previousCount === 0
        ? null
        : ((currentCount - previousCount) / previousCount) * 100;

    res.json({
      total: currentCount,
      percentageChange: percentageChange?.toFixed(2) ?? null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al calcular órdenes canceladas" });
  }
};
