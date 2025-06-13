const Order = require("../models/Order");
const dayjs = require("dayjs");

const calculateOrderTotal = (orders) => {
  return orders.reduce((sum, order) => {
    const orderTotal = order.items.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0
    );
    return sum + orderTotal;
  }, 0);
};

exports.getNetIncome = async (req, res) => {
  try {
    const userId = req.user.id;

    const from =
      req.query.from || dayjs().subtract(7, "day").startOf("day").toISOString();
    const to = req.query.to || dayjs().endOf("day").toISOString();

    const fromDate = new Date(from);
    const toDate = new Date(to);
    const duration = toDate.getTime() - fromDate.getTime();

    const prevFrom = new Date(fromDate.getTime() - duration);
    const prevTo = fromDate;

    const currentOrders = await Order.find({
      user: userId,
      status: "COMPLETED",
      createdAt: { $gte: fromDate, $lte: toDate },
    });

    const currentTotal = calculateOrderTotal(currentOrders);

    const previousOrders = await Order.find({
      user: userId,
      status: "COMPLETED",
      createdAt: { $gte: prevFrom, $lte: prevTo },
    });

    const previousTotal = calculateOrderTotal(previousOrders);

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
    const userId = req.user.id;

    const from =
      req.query.from || dayjs().subtract(7, "day").startOf("day").toISOString();
    const to = req.query.to || dayjs().endOf("day").toISOString();

    const fromDate = new Date(from);
    const toDate = new Date(to);
    const duration = toDate.getTime() - fromDate.getTime();

    const prevFrom = new Date(fromDate.getTime() - duration);
    const prevTo = fromDate;

    const currentCount = await Order.countDocuments({
      user: userId,
      createdAt: { $gte: fromDate, $lte: toDate },
    });

    const previousCount = await Order.countDocuments({
      user: userId,
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
    const userId = req.user.id;

    const from =
      req.query.from || dayjs().subtract(7, "day").startOf("day").toISOString();
    const to = req.query.to || dayjs().endOf("day").toISOString();

    const fromDate = new Date(from);
    const toDate = new Date(to);
    const duration = toDate.getTime() - fromDate.getTime();

    const prevFrom = new Date(fromDate.getTime() - duration);
    const prevTo = fromDate;

    const currentOrders = await Order.find({
      user: userId,
      status: "COMPLETED",
      createdAt: { $gte: fromDate, $lte: toDate },
    });

    const currentTotal = calculateOrderTotal(currentOrders);
    const currentCount = currentOrders.length;
    const currentAverage = currentCount === 0 ? 0 : currentTotal / currentCount;

    const previousOrders = await Order.find({
      user: userId,
      status: "COMPLETED",
      createdAt: { $gte: prevFrom, $lte: prevTo },
    });

    const previousTotal = calculateOrderTotal(previousOrders);
    const previousCount = previousOrders.length;
    const previousAverage =
      previousCount === 0 ? 0 : previousTotal / previousCount;

    const percentageChange =
      previousAverage === 0
        ? null
        : ((currentAverage - previousAverage) / previousAverage) * 100;

    res.json({
      total: Number(currentAverage.toFixed(2)),
      percentageChange: percentageChange?.toFixed(2) ?? null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al calcular average sales" });
  }
};

exports.getCanceledOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const from =
      req.query.from || dayjs().subtract(7, "day").startOf("day").toISOString();
    const to = req.query.to || dayjs().endOf("day").toISOString();

    const fromDate = new Date(from);
    const toDate = new Date(to);
    const duration = toDate.getTime() - fromDate.getTime();

    const prevFrom = new Date(fromDate.getTime() - duration);
    const prevTo = fromDate;

    const currentCount = await Order.countDocuments({
      user: userId,
      status: "CANCELED",
      createdAt: { $gte: fromDate, $lte: toDate },
    });

    const previousCount = await Order.countDocuments({
      user: userId,
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
