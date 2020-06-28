const express = require('express');
const router = express.Router();
const proyectoController = require("../controllers/proyectoController");
const isAuth = require("../middlewares/isAuth");
const { check } = require("express-validator");

// Crea proyectos /api/proyectos -POST
router.post('/', isAuth, [
  check("nombre", "El nombre del proyecto es obligatorio").notEmpty()
], proyectoController.crearProyecto);

// Obtiene todos los proyectos /api/proyectos -GET
router.get('/', isAuth, proyectoController.obtenerProyectos);

// Actualizar proyecto via ID /api/proyectos/:id -PUT
router.put("/:id", isAuth, [
  check("nombre", "El nombre del proyecto es obligatorio").notEmpty()
], proyectoController.actualizarProyecto);

// Elimina un proyecto via ID /api/proyectos/:id -DELETE
router.delete("/:id", isAuth, proyectoController.eliminarProyecto);

module.exports = router;