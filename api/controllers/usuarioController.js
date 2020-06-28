const AuthService = require("../../services/authenticationService");
const { validationResult } = require('express-validator');
const error = new Error();

exports.crearUsuario = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    error.statusCode = 400;
    error.data = errors.array();
    return next(error);
  }
  const userDTO = req.body; //user Data Object
  const authServiceInstance = new AuthService();

  try {
    const { nombre, email, token } = await authServiceInstance.SignUp(userDTO);

    return res.status(201).json({
      message: "Usuario creado.",
      data: {
        nombre: nombre,
        email: email,
        token: token
      }
    });
  } catch (err) {
    return next(err);
  }
};

exports.autenticarUsuario = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    error.statusCode = 400;
    error.data = errors.array();
    return next(error);
  }
  const userDTO = req.body;
  const authServiceInstance = new AuthService();

  try {
    const { token } = await authServiceInstance.login(userDTO);
    return res.status(200).json({ data: { token: token } });
  } catch (error) {
    return next(error);
  }
};

// Retorna que usuario esta autenticado
exports.usuarioAutenticado = async (req, res, next) => {
  try {
    const authServiceInstance = new AuthService();
    const usuario = await authServiceInstance.usuarioAutenticado(req.usuario.id);
    return res.status(200).json({ status: "success", data: { usuario } });
  } catch (error) {
    return next(error);
  }
};