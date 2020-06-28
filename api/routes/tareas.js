const express = require("express");
const route = express.Router();
const tareaController = require("../controllers/tareaController");
const isAuth = require("../middlewares/isAuth");
const { check } = require("express-validator");

// Obtener las tareas por proyecto /api/tareas -GET
route.get("/", isAuth,
  tareaController.obtenerTareas);

// Crea una tarea para un proyecto con su ID /api/tareas -POST
route.post("/", isAuth, [
  check("nombre", "El nombre es obligatorio").notEmpty(),
  check("proyecto", "El proyecto es obligatorio").notEmpty()
], tareaController.crearTarea);

// Edita una tarea con su ID /api/tareas -PUT
route.put("/:id", isAuth, [
  check("proyecto", "El proyecto es obligatorio").notEmpty()
], tareaController.actualizarTarea);

// Eliminar una tarea con su ID /api/tareas -DELETE
route.delete("/:id", isAuth, tareaController.eliminarTarea);

module.exports = route;