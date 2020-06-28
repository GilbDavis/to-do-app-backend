const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const logger = require("../helpers/logger");
const error = new Error();

class TareaService {

  async crearTarea(idUsuario, idProyecto, data) {
    try {
      const existeProyecto = await Proyecto.findById(idProyecto);
      if (!existeProyecto || existeProyecto == "undefined") {
        logger.error(`El proyecto ${idProyecto} no existe`);
        error.statusCode = 404;
        error.data = { message: "Proyecto no encontrado" };
        throw error;
      }
      if (existeProyecto.creador.toString() !== idUsuario) {
        logger.debug(`El usuario ${idUsuario} no esta autorizado para crear esa tarea`);
        error.statusCode = 401;
        error.data = {
          message: "No Autorizado"
        };
        throw error;
      }
      const tarea = new Tarea(data);
      await tarea.save();
      return tarea;
    } catch (error) {
      logger.warn("Ocurrio un error en el servicio crearTarea");
      throw error;
    }
  }

  async obtenerTareas(idUsuario, idProyecto) {
    try {
      const existeProyecto = await Proyecto.findById(idProyecto);
      if (!existeProyecto) {
        logger.error(`El proyecto ${idProyecto} no existe`);
        error.statusCode = 404;
        error.data = { message: "Proyecto no encontrado" };
        throw error;
      }
      if (existeProyecto.creador.toString() !== idUsuario) {
        logger.debug(`El usuario ${idUsuario} no esta autorizado para realizar esta accion`);
        error.statusCode = 401;
        error.data = {
          message: "No Autorizado"
        };
        throw error;
      }
      const tareas = await Tarea.find({ proyecto: idProyecto }).sort({ created_at: -1 });
      if (!tareas) {
        logger.debug(`No hay tareas que coincidan con el proyecto ${idProyecto}`);
        error.statusCode = 404;
        error.data = {
          message: "No se encontraron tareas"
        };
        throw error;
      }
      return tareas;
    } catch (error) {
      logger.warn("Ocurrio un error en el servicio obtenerTarea");
      throw error;
    }
  }

  async actualizarTarea(idProyecto, idTarea, idUsuario, data) {
    try {
      // Revisar si la tarea existe
      let tarea = await Tarea.findById(idTarea);
      if (!tarea) {
        logger.error(`La tarea ${idTarea} no existe`);
        error.statusCode = 404;
        error.data = { message: "Tarea no encontrada" };
        throw error;
      }
      const existeProyecto = await Proyecto.findById(idProyecto);
      if (existeProyecto.creador.toString() !== idUsuario) {
        logger.debug(`El usuario ${idUsuario} no esta autorizado para realizar esta accion`);
        error.statusCode = 401;
        error.data = {
          message: "No Autorizado"
        };
        throw error;
      }
      const nuevaTarea = {};
      if (data.nombre) { nuevaTarea.nombre = data.nombre }
      if (typeof data.estado === "boolean") { nuevaTarea.estado = data.estado }
      tarea = await Tarea.findOneAndUpdate({ _id: idTarea }, nuevaTarea, { new: true });
      logger.info(`La tarea ${idTarea} ha sido editada con exito`);
      return tarea;
    } catch (error) {
      logger.warn("Ocurrio u nerror en el servicio actualizarTarea");
      throw error;
    }
  }

  async eliminarTarea(idProyecto, idTarea, idUsuario) {
    try {
      // Revisar si la tarea existe
      let tarea = await Tarea.findById(idTarea);
      if (!tarea) {
        logger.error(`La tarea ${idTarea} no existe`);
        error.statusCode = 404;
        error.data = { message: "Tarea no encontrada" };
        throw error;
      }
      const existeProyecto = await Proyecto.findById(idProyecto);
      if (existeProyecto.creador.toString() !== idUsuario) {
        logger.debug(`El usuario ${idUsuario} no esta autorizado para realizar esta accion`);
        error.statusCode = 401;
        error.data = {
          message: "No Autorizado"
        };
        throw error;
      }
      await Tarea.findOneAndRemove({ _id: idTarea });
      return logger.info(`La tarea ${idTarea} ha sido eliminado con exito`);
    } catch (error) {
      logger.warn("Ocurrio u nerror en el servicio eliminarTarea");
      throw error;
    }
  }
}

module.exports = TareaService;