const express = require('express');
const apiRoute = express();

apiRoute.use("/proyectos", require("./proyectos"));
apiRoute.use("/usuarios", require("./usuarios"));
apiRoute.use("/tareas", require("./tareas"));

module.exports = apiRoute;