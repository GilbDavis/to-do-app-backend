const jwt = require("jsonwebtoken");
const config = require("../../config/config");
const logger = require("../../helpers/logger");
const error = new Error();

module.exports = (req, res, next) => {
  // extraer el token del header
  const token = req.get("Authorization");
  logger.debug("Extrayendo token...");
  // Revisar no hay token
  if (!token) {
    logger.error("No se encontro el token");
    error.statusCode = 401;
    error.data = {
      message: "No se encontro un token, permiso no valido"
    };
    throw next(error);
  }
  logger.debug("Verificando validez del token...");
  // validar el token
  try {
    const cifrado = jwt.verify(token, config.jwt_secret);
    req.usuario = cifrado.usuario;
    logger.debug("El token fue validado con exito");
    return next();
  } catch (error) {
    logger.warn("El token introducido no es valido");
    error.statusCode = 401;
    error.data = {
      message: "Token no valido"
    };
    throw error;
  }
};