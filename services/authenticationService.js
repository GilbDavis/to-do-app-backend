const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const logger = require("../helpers/logger");
const error = new Error();

class AuthService {

  async SignUp(user) {
    // eslint-disable-next-line no-useless-catch
    try {
      const usuario = new Usuario(user);

      const salt = await bcrypt.genSalt(10);
      usuario.password = await bcrypt.hash(usuario.password, salt);

      await usuario.save();
      if (!usuario) {
        logger.error("falló la creacion del usuario");
        throw new Error("Ha ocurrido un error al intentar crear el usuario");
      }
      logger.info("Usuario creado!");

      const payload = {
        usuario: {
          id: usuario.id
        }
      };
      const token = jwt.sign(payload, config.jwt_secret, {
        expiresIn: "1h"
      });
      if (!token) {
        logger.error("Ocurrio un error al intentar generar el JWT");
        throw new Error("Ha ocurrido un error al generar el token");
      }
      logger.debug("Token generado");

      logger.info("Usuario registrado exitosamente");
      return {
        nombre: usuario.nombre,
        email: usuario.email,
        token: token
      };
    } catch (error) {
      logger.error("Ocurrio un error en el servicio de registrar usuario");
      throw error;
    }
  }

  async login(user) {
    try {
      const usuario = await Usuario.findOne({ email: user.email });
      if (!usuario) {
        logger.error(`El correo ${user.email} no existe`);
        error.statusCode = 400;
        error.data = {
          message: "El usuario no existe"
        };
        throw error;
      }
      logger.debug("Usuario encontrado");
      const passCorrecto = await bcrypt.compare(user.password, usuario.password);
      if (!passCorrecto) {
        logger.error(`El Usuario ${usuario.email} ingresó una contraseña incorrecta`);
        error.statusCode = 400;
        error.data = {
          message: "Password Incorrecto"
        };
        throw error;
      }
      const payload = {
        usuario: {
          id: usuario.id
        }
      };
      const token = jwt.sign(payload, config.jwt_secret, {
        expiresIn: "1h"
      });
      if (!token) {
        logger.error("Ocurrio un error al intentar generar el JWT");
        throw new Error("Ha ocurrido un error al generar el token");
      }
      logger.debug("Token generado");
      logger.info(`El Usuario ${usuario.email} ha iniciado sesión`);
      return { token: token };
    } catch (error) {
      logger.debug("Ocurrio un error en el servicio de iniciar sesion");
      throw error;
    }
  }

  async usuarioAutenticado(idUsuario) {
    try {
      const usuario = await Usuario.findById(idUsuario).select("-password");
      return usuario;
    } catch (error) {
      logger.error("Ocurrio un error en el servicio usuarioAutenticado");
      throw error;
    }
  }
}

module.exports = AuthService;