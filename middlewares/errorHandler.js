/**
 * Middleware de manejo de errores que centraliza la respuesta de error.
 *
 * @param {Error} err - Objeto de error capturado.
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @param {import('express').NextFunction} next - Función para pasar al siguiente middleware.
 * @returns {object} Respuesta JSON con estructura estandarizada de error.
 */
const errorHandler = (err, req, res, next) => {
  console.error("Error capturado:", err);

  const statusCode = err.statusCode || 500;
  const code = err.code || "INTERNAL_ERROR";
  const message = err.message || "Ocurrió un error inesperado";

  return res.status(statusCode).json({
    error: {
      code,
      message,
    },
  });
};

module.exports = errorHandler;
