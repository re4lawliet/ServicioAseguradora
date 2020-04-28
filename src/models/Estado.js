  
const { Schema, model } = require("mongoose");

const EstadoSchema = new Schema(
    {
        id: {
            type: Number
        },
        nombre: {
            type: String
        },
        subastable: {
            type: Boolean
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = model("Estado", EstadoSchema);