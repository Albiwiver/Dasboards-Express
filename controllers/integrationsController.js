const Integration = require("../models/Integration");
const UserIntegration = require("../models/UserIntegration");

exports.getIntegrations = async (req, res) => {
  try {
    const userId = req.user.id;

    const [allIntegrations, userIntegrations] = await Promise.all([
      Integration.find(),
      UserIntegration.find({ user: userId }),
    ]);

    const userIntegrationMap = new Map(
      userIntegrations.map((ui) => [ui.integration.toString(), ui.connected])
    );

    const results = allIntegrations.map((integration) => ({
      id: integration._id,
      key: integration.key,
      title: integration.title,
      description: integration.description,
      image: integration.image,
      rateReviews: integration.rateReviews,
      rate: integration.rate,
      connected: userIntegrationMap.get(integration._id.toString()) || false,
    }));

    return res.json({ data: results });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error al obtener las integraciones" });
  }
};

exports.updateIntegrationStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { integrationId } = req.params;
    const { connected } = req.body;

    if (typeof connected !== "boolean") {
      return res
        .status(400)
        .json({ message: "El campo 'connected' debe ser booleano" });
    }

    const updated = await UserIntegration.findOneAndUpdate(
      { user: userId, integration: integrationId },
      { connected },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      message: `Integración ${
        connected ? "conectada" : "desconectada"
      } correctamente`,
      data: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la integración" });
  }
};
