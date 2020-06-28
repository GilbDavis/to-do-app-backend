const ProyectoService = require("../../services/proyectoService");
const { validationResult } = require("express-validator");
const error = new Error();

// Crea proyectos nuevos
exports.crearProyecto = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    error.statusCode = 400;
    error.data = errors.array();
    return next(error);
  }

  try {
    const proyectoDTO = {
      nombre: req.body.nombre,
      creador: req.usuario.id
    };
    const ProyectoServiceInstance = new ProyectoService();
    const nuevoProyecto = await ProyectoServiceInstance.crearProyecto(proyectoDTO);
    return res.status(201).json({ status: "success", data: nuevoProyecto });
  } catch (error) {
    return next(error);
  }
};

// Obtiene todos los proyectos del ususrio actual
exports.obtenerProyectos = async (req, res, next) => {
  try {
    const ProyectoServiceInstance = new ProyectoService();
    const proyectos = await ProyectoServiceInstance.obtenerProyectos(req.usuario.id);
    return res.status(200).json({ status: "success", data: { proyectos } });
  } catch (error) {
    return next(error);
  }
};

// Actualiza un proyecto
exports.actualizarProyecto = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    error.statusCode = 400;
    error.data = errors.array();
    return next(error);
  }
  // eslint-disable-next-line no-useless-catch
  try {
    const ProyectoServiceInstance = new ProyectoService();
    const proyecto = await ProyectoServiceInstance.actualizarProyecto(req.params.id, req.usuario.id, req.body);
    return res.status(200).json({ status: "success", data: proyecto });
  } catch (error) {
    return next(error);
  }
};

// Elimina un proyecto
exports.eliminarProyecto = async (req, res, next) => {
  try {
    const ProyectoServiceInstance = new ProyectoService();
    await ProyectoServiceInstance.eliminarProyecto(req.usuario.id, req.params.id);
    return res.status(200).json({ status: "success", message: "Proyecto eliminado" });
  } catch (error) {
    return next(error);
  }
};