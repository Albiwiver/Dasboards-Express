/**
 * Envía una respuesta de éxito con formato uniforme
 *
 * @param {object} res - Response de Express
 * @param {number} statusCode - Código de estado HTTP
 * @param {string} message - Mensaje opcional
 * @param {object|null} data - Información opcional de respuesta
 */
const successResponse = (res, statusCode = 200, message = "", data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

module.exports = successResponse;
