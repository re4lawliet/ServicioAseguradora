  
const { Schema, model } = require("mongoose");

const VehiculoGaleriaSchema = new Schema(
    {
        id_vehiculo: {
            type: String,
            required: true
        },
        foto1: {
            type: String,
        },
        foto2: {
            type: String,
        },
        foto3: {
            type: String,
        },
        foto4: {
            type: String
        },
        foto5: {
            type: String
        },
        estado1: {
            type: Boolean
        },
        estado2: {
            type: Boolean
        },
        estado3: {
            type: Boolean
        },
        estado4: {
            type: Boolean
        },
        estado5: {
            type: Boolean
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = model("VehiculoGaleria", VehiculoGaleriaSchema);