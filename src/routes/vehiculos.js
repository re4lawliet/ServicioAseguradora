// Rutas de Vehiculo
const express = require('express');
const router =  express.Router();
const fetch = require('node-fetch');
const fetchQuery = require('../request-manager');


const Vehiculo = require('../models/Vehiculo');
const VehiculoGaleria = require('../models/VehiculoGaleria');
const { isAuthenticated } = require('../helpers/auth');

//Funcion para lanzar formulariode Nueva Nota
router.get('/vehiculos/nuevo_vehiculo', isAuthenticated, (req, res) => {
    res.render('vehiculos/new_vehiculo.hbs');
});

//Funcion para enviar datos de nueva nota [POST]
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
router.get('/vehiculos/all', async(req, res) => {
    /*const vehiculos = await Vehiculo.find({id_ajustador: req.user.id}).sort({date:'desc'})
    const vehiculos2=[];
    
    for(var v in vehiculos){
        vehiculos2.push({
            id: vehiculos[v]._id, tipo:vehiculos[v].tipo, marca:vehiculos[v].marca,
            linea:vehiculos[v].linea, modelo:vehiculos[v].modelo, placa:vehiculos[v].placa,
            chasis:vehiculos[v].chasis, motor:vehiculos[v].motor, color:vehiculos[v].color,
            direccion: vehiculos[v].direccion
            });
    }
    res.render('vehiculos/all_vehiculos.hbs', { 
        vehiculos2 
    });*/

    fetchQuery('http://localhost:3000/vehiculos/all2', 'GET').then(res2 => {

      if (res2.success) {
        console.log(res2);
        res.send(res2);
      } else {
        console.log('No hay repartidores disponibles');
      }

    });
});

router.get('/vehiculos/all2', async(req, res) => {
    const vehiculos = await Vehiculo.find().sort({date:'desc'})
    res.send(vehiculos);
});

router.get('/vehiculos/edit/:id', isAuthenticated, async(req, res) => {
    const note1 = await Note.findById(req.params.id);

    const note=[];
    note.push({
        title: note1.title, 
        description: note1.description, 
        _id:note1._id
    });
    res.render('notes/edit-note.hbs', {note});
});

router.put('/notas/edit-note/:id', isAuthenticated, async(req, res) => {
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description});
    req.flash('succes_msg','Se a Actualizada');
    res.redirect('/notas/notas');
});

router.delete('/notas/delete/:id', isAuthenticated, async(req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('succes_msg','Se A eliminado');
    res.redirect('/notas/notas');
});

module.exports = router;