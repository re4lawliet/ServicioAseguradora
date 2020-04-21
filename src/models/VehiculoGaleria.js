  
const { Schema, model } = require("mongoose");

const VehiculoGaleriaSchema = new Schema(
    {
        id_vehiculo: {
            type: String,
            required: true
        },
        foto: {
            type: String,
        },
        estado: {
            type: Boolean
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = model("VehiculoGaleria", VehiculoGaleriaSchema);