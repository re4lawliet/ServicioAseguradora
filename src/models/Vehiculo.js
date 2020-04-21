  
const { Schema, model } = require("mongoose");

const VehiculoSchema = new Schema(
    {
        id_ajustador: {
            type: String,
            required: true
        },
        id_aseguradora: {
            type: String,
            required: true
        },
        tipo: {
            type: String,
            required: true
        },
        marca: {
            type: String,
            required: true
        },
        linea: {
            type: String
        },
        modelo: {
            type: String
        },
        placa: {
            type: String
        },
        chasis: {
            type: String
        },
        motor: {
            type: String
        },
        color: {
            type: String
        },
        direccion: {
            type: String
        },
        estado: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = model("Vehiculo", VehiculoSchema);