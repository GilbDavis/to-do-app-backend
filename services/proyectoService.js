const Proyecto = require("../models/Proyecto");
const logger = require("../helpers/logger");
const error = new Error();

class ProyectoService {

  async crearProyecto(input) {
    try {
      const proyecto = new Proyecto(input);
      await proyecto.save();
      if (!proyecto) {
        logger.error("Ocurrio un error al intentar crear el proyecto");
        throw new Error("Ocurrio un error al intentar crear el proyecto");
      }
      return proyecto;
    } catch (error) {
      logger.warn("Ocurrio un error en el servicio de crearProyectos");
      throw error;
    }
  }

  async obtenerProyectos(idUsuario) {
    // eslint-disable-next-line no-useless-catch
    try {
      const proyectos = await Proyecto.find({ creador: idUsuario }).sort({ created_at: -1 });
      if (!proyectos) {
        logger.error("No se encontraron registros de proyectos");
        error.statusCode = 200;
        error.data = {
          message: "No se encontraron los proyectos"
        };
        throw error;
      }
      return proyectos;
    } catch (error) {
      logger.warn("Ha ocurrido un error en el serivicio obtenerProyectos");
      throw error;
    }
  }

  async actualizarProyecto(idProyecto, idUsuario, input) {
    try {
      let proyecto = await Proyecto.findById(idProyecto);
      logger.debug("Buscando proyecto...");
      if (!proyecto) {
        logger.debug(`No se encontro el proyecto con id: ${idProyecto}`);
        error.statusCode = 404;
        error.data = {
          message: "Proyecto no encontrado"
        };
        throw error;
      }
      logger.debug("Verificando credenciales del creador...");
      if (proyecto.creador.toString() !== idUsuario) {
        logger.debug(`El usuario ${idUsuario} no esta autorizado para editar el proyecto ${idProyecto}`);
        error.statusCode = 401;
        error.data = {
          message: "No Autorizado"
        };
        throw error;
      }
      proyecto = await Proyecto.findByIdAndUpdate({ _id: idProyecto },
        { $set: input }, { new: true });
      logger.info(`Proyecto ${idProyecto} modificado con exito`);
      return proyecto;
    } catch (error) {
      logger.warn("Error en el servicio actualizarProyecto");
      throw error;
    }
  }

  async eliminarProyecto(idUsuario, idProyecto) {

    try {
      let proyecto = await Proyecto.findById(idProyecto);
      logger.debug("Buscando proyecto...");
      if (!proyecto) {
        logger.debug(`No se encontro el proyecto con id: ${idProyecto}`);
        error.statusCode = 404;
        error.data = {
          message: "Proyecto no encontrado"
        };
        throw error;
      }
      logger.debug("Verificando credenciales del creador...");
      if (proyecto.creador.toString() !== idUsuario) {
        logger.debug(`El usuario ${idUsuario} no esta autorizado para eliminar el proyecto ${idProyecto}`);
        error.statusCode = 401;
        error.data = {
          message: "No Autorizado"
        };
        throw error;
      }
      await Proyecto.findByIdAndRemove({ _id: idProyecto });
      logger.info(`Proyecto ${idProyecto} ha sido eliminado`);
    } catch (error) {
      logger.warn("Ocurrio un error en el servicio eliminarProyecto");
      throw error;
    }
  }
}

module.exports = ProyectoService;