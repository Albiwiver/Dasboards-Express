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
