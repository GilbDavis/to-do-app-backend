const express = require("express");
const route = express.Router();
const Usuario = require('../../models/Usuario');
const usuarioController = require("../controllers/usuarioController");
const { check } = require('express-validator');
const isAuth = require("../middlewares/isAuth");

// Obtiene el usuario autenticado /api/usuarios -GET
route.get("/", isAuth, usuarioController.usuarioAutenticado);

// Crear un usuario api/usuarios/register -POST
route.post("/register", [
  check("nombre").trim().not().isEmpty().isString().withMessage("El nombre es obligatorio"),
  check("email").trim().isEmail().withMessage("Ingrese un email valido.")
    .custom((value, { req }) => {
      return Usuario.findOne({ email: value })
        .then(userDoc => {
          if (userDoc) {
            return Promise.reject("Este correo electronico ya fue utilizado.");
          }
        })
    }).normalizeEmail({ gmail_remove_dots: false, gmail_lowercase: true }),
  check("password").trim().notEmpty().withMessage("Ingrese una contraseña").isLength({ min: 6 }).withMessage("Minimo 6 caracteres.")
], usuarioController.crearUsuario);

// Iniciar sesion api/usuarios/login -POST
route.post("/login", usuarioController.autenticarUsuario);

module.exports = route;