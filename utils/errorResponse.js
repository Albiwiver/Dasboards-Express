/**
 * Envía una respuesta de error con formato uniforme
 *
 * @param {object} res - Response de Express
 * @param {number} statusCode - Código de estado HTTP
 * @param {string} message - Mensaje opcional
 */
const errorResponse = (res, statusCode, code, message) => {
  return res.status(statusCode).json({
    error: {
      code,
      message,
    },
  });
};

module.exports = errorResponse;
