// Rutas de Vehiculo
const express = require('express');
const router =  express.Router();
const fetch = require('node-fetch');
const fetchQuery = require('../request-manager');
const multer = require('multer');
const upload = require('../config/storage');


const Vehiculo = require('../models/Vehiculo');
const VehiculoGaleria = require('../models/VehiculoGaleria');
const { isAuthenticated } = require('../helpers/auth');
const app = express();


//************       Metodos de Funcionalidad   *************************/

router.get('/vehiculos/nuevo_vehiculo', isAuthenticated, (req, res) => {
    res.render('vehiculos/new_vehiculo.hbs');
});

router.post('/vehiculos/crear_vehiculo', isAuthenticated, async(req, res) => {
    
    const{ tipo,marca,linea,modelo,placa,chasis,motor,color,direccion } = req.body;
    const errors=[];
    

    
    if(errors.length>0){
        res.render('vehiculos/new_vehiculo.hbs', {
            errors
        });
    }else{
        const new_vehiculo = new Vehiculo();
        new_vehiculo.id_ajustador = req.user.id;
        new_vehiculo.id_aseguradora = 'id_aseguradora';
        new_vehiculo.tipo = tipo;
        new_vehiculo.marca = marca;
        new_vehiculo.linea = linea;
        new_vehiculo.modelo = modelo;
        new_vehiculo.placa = placa;
        new_vehiculo.chasis = chasis;
        new_vehiculo.motor = motor;
        new_vehiculo.color = color;
        new_vehiculo.direccion = direccion;
        new_vehiculo.estado = '0';
        await new_vehiculo.save();
        req.flash('succes_msg', 'Vehiculo Agregado con Exito');
        res.redirect('/vehiculos/all');
    }
});

router.get('/vehiculos/all', isAuthenticated, async(req, res) => {
    const vehiculos = await Vehiculo.find({id_ajustador: req.user.id}).sort({date:'desc'})
    const vehiculos2=[];
    
    for(var v in vehiculos){
        vehiculos2.push({
            _id: vehiculos[v]._id, tipo:vehiculos[v].tipo, marca:vehiculos[v].marca,
            linea:vehiculos[v].linea, modelo:vehiculos[v].modelo, placa:vehiculos[v].placa,
            chasis:vehiculos[v].chasis, motor:vehiculos[v].motor, color:vehiculos[v].color,
            direccion: vehiculos[v].direccion
            });
    }
    res.render('vehiculos/all_vehiculos.hbs', { 
        vehiculos2 
    });
    /*
    fetch("http://localhost:3000/vehiculos/all2", {
        method: "get",
        headers: { "Content-Type": "application/json" },
        timeout: 3000,
    })
    .then((res) => res.json())
    .then((json) =>
      res.render("vehiculos/all_vehiculos.hbs", { vehiculos2: json })
    )
    .catch(function (err) {
      return res
        .status(500)
        .json({ estado: 500, mensaje: "Tiempo de respuesta exedido." });
    });
    */
});

router.get('/vehiculos/edit/:id', isAuthenticated, async(req, res) => {
    const veh=[];
    veh.push({
        id_vehiculo: req.params.id
    });
    res.render('vehiculos/edit_vehiculo.hbs', {veh});
});

router.post('/subir/:id', upload.single('foto1'), async(req,res) =>{
    
    const{ foto,estado } = req.body;

    const new_imagen = new VehiculoGaleria();
    new_imagen.id_vehiculo = req.params.id;
    new_imagen.foto = req.file.originalname;
    new_imagen.estado = req.body.foto1_e;
    await new_imagen.save();

    req.flash('succes_msg', 'Imagen Subida Con Exito');
    res.redirect('/vehiculos/all');
});

router.get('/vehiculos/ver/:id', isAuthenticated, async(req, res) => {
    console.log(req.user.id);
    const galeria = await VehiculoGaleria.find({id_vehiculo: req.params.id}).sort({date:'desc'})
    const galeria2=[];

    const vehiculos = await Vehiculo.find({_id: req.params.id}).sort({date:'desc'})
    const vehiculos2=[];
    
    for(var v in vehiculos){
        vehiculos2.push({
            _id: vehiculos[v]._id, tipo:vehiculos[v].tipo, marca:vehiculos[v].marca,
            linea:vehiculos[v].linea, modelo:vehiculos[v].modelo, placa:vehiculos[v].placa,
            chasis:vehiculos[v].chasis, motor:vehiculos[v].motor, color:vehiculos[v].color,
            direccion: vehiculos[v].direccion
        });
    }

    for(var g in galeria){
        galeria2.push({
            foto: galeria[g].foto
        });
    }
    
    console.log(vehiculos2);
    console.log(galeria2);

    res.render('vehiculos/see_vehiculos.hbs', { 
        vehiculos2,
        galeria2 
    });
});



//************       Metodos de Servicio     ******************************/

router.get('/vehiculos/all3', isAuthenticated, async(req, res) => {

    fetch("http://localhost:3000/vehiculos/all2", {
        method: "get",
        headers: { "Content-Type": "application/json" },
        timeout: 3000,
    })
    .then((res) => res.json())
    .then((json) =>
      res.render("vehiculos/all_vehiculos.hbs", { vehiculos2: json })
    )
    .catch(function (err) {
      return res
        .status(500)
        .json({ estado: 500, mensaje: "Tiempo de respuesta exedido." });
    });
    
});//Consume 
router.get('/vehiculos/all2', isAuthenticated, async(req, res) => {
    const vehiculos = await Vehiculo.find({id_ajustador: req.user.id}).sort({date:'desc'});
    res.send(vehiculos);
});//sirve

//*************************************************************************/

router.delete('/notas/delete/:id', isAuthenticated, async(req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('succes_msg','Se A eliminado');
    res.redirect('/notas/notas');
});

module.exports = router;