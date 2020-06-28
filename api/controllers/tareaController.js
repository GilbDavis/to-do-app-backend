const TareaService = require("../../services/tareaService");
const { validationResult } = require("express-validator");
const error = new Error();

exports.crearTarea = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    error.statusCode = 400;
    error.data = errors.array();
    return next(error);
  }

  try {
    const tareaServiceInstance = new TareaService();
    const tarea = await tareaServiceInstance.crearTarea(req.usuario.id, req.body.proyecto, req.body);
    return res.status(201).json({ status: "success", data: tarea });
  } catch (error) {
    return next(error);
  }
};

// Obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res, next) => {
  try {
    const tareaServiceInstance = new TareaService();
    const tareas = await tareaServiceInstance.obtenerTareas(req.usuario.id, req.query.proyecto);
    return res.status(200).json({ status: "success", data: { tareas: tareas } });
  } catch (error) {
    return next(error);
  }
};

// Actualizar una tarea
exports.actualizarTarea = async (req, res, next) => {
  try {
    const tareaServiceInstance = new TareaService();
    const inputDTO = {
      nombre: req.body.nombre,
      estado: req.body.estado
    };
    const tareaEditada = await tareaServiceInstance
      .actualizarTarea(req.body.proyecto,
        req.params.id, req.usuario.id, inputDTO);
    return res.status(200).json({ status: "success", data: { tarea: tareaEditada } });
  } catch (error) {
    return next(error);
  }
};

// Eliminar un tarea
exports.eliminarTarea = async (req, res, next) => {
  try {
    const tareaServiceInstance = new TareaService();
    await tareaServiceInstance.eliminarTarea(req.query.proyecto, req.params.id, req.usuario.id);
    return res.status(200).json({ status: "success", message: "Tarea eliminada" });
  } catch (error) {
    return next(error);
  }
};