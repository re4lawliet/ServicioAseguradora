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
const URL_SERVER='http://localhost:3000/';


//************       Metodos de Funcionalidad   *************************/

router.get('/vehiculos/nuevo_vehiculo', (req, res) => {
    res.render('vehiculos/new_vehiculo.hbs');
});

router.post('/vehiculos/crear_vehiculo', async(req, res) => {
    
    const{ 
        estado,tipo,marca,linea,modelo,placa,color,arranca,camina,
        falla_mecanica,garantia_inspeccion,inundado,colision,chasis,
        motor,direccion 
    } = req.body;
    const errors=[];
    
    if(errors.length>0){
        res.render('vehiculos/new_vehiculo.hbs', {
            errors
        });
    }else{
        const new_vehiculo = new Vehiculo();
        new_vehiculo.id_ajustador = req.user.id;
        new_vehiculo.id_aseguradora = 'id_aseguradora';
        new_vehiculo.estado=estado;
        new_vehiculo.tipo = tipo;
        new_vehiculo.marca = marca;
        new_vehiculo.linea = linea;
        new_vehiculo.modelo = modelo;
        new_vehiculo.placa = placa;
        new_vehiculo.color = color;
        new_vehiculo.arranca=arranca;
        new_vehiculo.camina=camina;
        new_vehiculo.falla_mecanica=falla_mecanica;
        new_vehiculo.garantia_inspeccion=garantia_inspeccion;
        new_vehiculo.inundado=inundado;
        new_vehiculo.colision=colision;
        new_vehiculo.chasis = chasis;
        new_vehiculo.motor = motor;
        new_vehiculo.direccion = direccion;
        new_vehiculo.subastable = true;
        new_vehiculo.nombre = 'Inspeccion';

        await new_vehiculo.save();
        req.flash('succes_msg', 'Vehiculo Agregado con Exito');
        res.redirect('/vehiculos/all');
    }
});

router.get('/vehiculos/all',  async(req, res) => {
    /*
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
    */
    const URL=URL_SERVER+"vehiculo/";
    fetch(URL, {
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
    
});

router.get('/vehiculos/edit/:id',  async(req, res) => {
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

router.get('/vehiculos/ver/:id', async(req, res) => {
    /*
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
    }/

    for(var g in galeria){
        galeria2.push({
            foto: galeria[g].foto
        });
    }
    
    res.render('vehiculos/see_vehiculos.hbs', { 
        vehiculos2,
        galeria2 
    });*/

    const id_vehiculo=req.params.id;
    const URL_GALERIA = URL_SERVER+"foto/"+id_vehiculo;
    const URL_VEHICULOS=URL_SERVER+"vehiculo/"+id_vehiculo;
    
    fetch(URL_GALERIA, {
        method: "get",
        headers: { "Content-Type": "application/json" },
        timeout: 3000,
    })
    .then((res) => res.json())
    .then((json) =>
    
        fetch(URL_VEHICULOS, {
            method: "get",
            headers: { "Content-Type": "application/json" },
            timeout: 3000,
        })
        .then((res) => res.json())
        .then((json2) =>
            res.render("vehiculos/see_vehiculos.hbs", { galeria2: json, vehiculos2: json2 })
        )
        .catch(function (err) {
        return res
            .status(500)
            .json({ estado: 500, mensaje: "Tiempo de respuesta exedido." });
        })

    )
    .catch(function (err) {
      return res
        .status(500)
        .json({ estado: 500, mensaje: "Tiempo de respuesta exedido." });
    });

    console.log(x);
    res.send(x);

});

router.delete('/vehiculos/delete/:id', async(req, res) => {
    await Vehiculo.findByIdAndDelete(req.params.id);
    req.flash('succes_msg','Se A eliminado Vehiculo');
    res.redirect('/vehiculos/all');
});

//************       Metodos de Servicio     ******************************/

router.get('/vehiculo/:id?/:placa?/:estado?', async(req, res) => {

    /*
    if(!req.params.placa){
        res.send('El JWT no es válido o no contiene el scope de este servicio').status(403);
    }*/
    let consulta = {};
    if(req.params.id){
        consulta._id=req.params.id;
    }
    if(req.params.placa){
        consulta.placa=req.params.placa;
    }
    if(req.params.estado){
        consulta.estado=req.params.estado;
    }

    const vehiculos = await Vehiculo.find(consulta).sort({date:'desc'});
    res.send(vehiculos).status(200);

});//Sirve arreglo de vehiculos

router.get('/foto/:id?/:externa?', async(req, res) => {

    const idd=req.params.id;
    if(!idd){
        res.send('El id No existe 404').status(404);
    }
    let consulta = {};
    consulta.id_vehiculo=idd;
    if(req.params.externa){
        consulta.estado=req.params.externa;
    }
    const fotos = await VehiculoGaleria.find(consulta);
    res.send(fotos).status(200);

});//Sirve Fotos


//*************************************************************************/

router.get('/vehiculos/all3', async(req, res) => {

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
    
}); //Consumidor Ejemplo


module.exports = router;