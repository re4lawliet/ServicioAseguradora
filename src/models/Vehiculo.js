  
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
        estado: {
            type: Number,
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
        color: {
            type: String
        },
        arranca: {
            type: Boolean
        },
        camina: {
            type: Boolean
        },
        fallas_mecanica: {
            type: Boolean
        },
        garantia_inspeccion: {
            type: Boolean
        },
        inundado: {
            type: Boolean
        },
        colision: {
            type: Boolean
        },
        chasis: {
            type: String
        },
        motor: {
            type: String
        },
        direccion: {
            type: String
        },
        precio_base: {
            type: Number
        },
        minimo_requerido: {
            type: Number
        },
        subastable: {
            type: Boolean
        },
        nombre_estado: {
            type: String
        },
        afiliado_adjudicado: {
            type: String
        },
        valor_adjudicacion: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = model("Vehiculo", VehiculoSchema);