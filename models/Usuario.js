const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const UsuariosSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  }
},
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

UsuariosSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Usuario", UsuariosSchema);