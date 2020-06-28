const express = require("express");
const config = require("./config/config");
const conectarDB = require("./config/db");
const cors = require("cors");
const morgan = require('morgan');
const app = express();

app.use(cors());
app.use(express.json({ extended: true }));
app.use(morgan('dev'));

app.use(config.api.prefix, require('./api/routes/index'));

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});
// Error handling purpose
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  res.status(err.statusCode || 500).json({ status: "error", errors: err.data });
});

app.listen(config.port, () => {
  conectarDB();
});