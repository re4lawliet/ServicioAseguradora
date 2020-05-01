// Rutas de Vehiculo
const express = require('express');
const router =  express.Router();
const fetch = require('node-fetch');
const fetchQuery = require('../request-manager');
const multer = require('multer');
const upload = require('../config/storage');


const Vehiculo = require('../models/Vehiculo');
const VehiculoGaleria = require('../models/VehiculoGaleria');
const Estado = require('../models/Estado');
const { isAuthenticated } = require('../helpers/auth');
const app = express();
const URL_SERVER='http://localhost:3000/';
const jwt = require('jsonwebtoken');
const data = require('../keys.json');
const KEY="201314646";


//************       Metodos de Funcionalidad   *************************/

router.get('/vehiculos/nuevo_vehiculo', (req, res) => {
    res.render('vehiculos/new_vehiculo.hbs');
});

router.post('/vehiculos/crear_vehiculo', async(req, res) => {
    
    const{ 
        estado,tipo,marca,linea,modelo,placa,color,arranca,camina,
        falla_mecanica,garantia_inspeccion,inundado,colision,chasis,
        motor,direccion,precio_base, minimo_requerido
    } = req.body;
    const errors=[];
    
    if(errors.length>0){
        res.render('vehiculos/new_vehiculo.hbs', {
            errors
        });
    }else{
        const new_vehiculo = new Vehiculo();
        new_vehiculo.id_ajustador = globalUser;
        new_vehiculo.id_aseguradora = globalAseguradora;
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
        new_vehiculo.precio_base=precio_base;
        new_vehiculo.minimo_requerido=minimo_requerido;
        new_vehiculo.subastable = false;
        new_vehiculo.afiliado_adjudicado="null";
        new_vehiculo.valor_adjudicacion="null"

        if(estado==1){
            new_vehiculo.nombre_estado = 'Tránsito';
        }else if(estado==2){
            new_vehiculo.nombre_estado = 'Almacenaje';
        }else{
            new_vehiculo.nombre_estado = 'Subastable';
        }
        

        await new_vehiculo.save();
        req.flash('succes_msg', 'Vehiculo Agregado con Exito');
        res.redirect('/vehiculos/all');
    }
});

router.get('/vehiculos/all',  async(req, res) => {
    
    const vehiculos = await Vehiculo.find({id_ajustador: globalUser}).sort({date:'desc'})
    const vehiculos2=[];
    
    for(var v in vehiculos){
        vehiculos2.push({
            _id: vehiculos[v]._id, tipo:vehiculos[v].tipo, marca:vehiculos[v].marca,
            linea:vehiculos[v].linea, modelo:vehiculos[v].modelo, placa:vehiculos[v].placa,
            chasis:vehiculos[v].chasis, motor:vehiculos[v].motor, color:vehiculos[v].color,
            direccion: vehiculos[v].direccion, id_aseguradora:vehiculos[v].id_aseguradora,
            nombre_estado: vehiculos[v].nombre_estado
            });
    }
    res.render('vehiculos/all_vehiculos.hbs', { 
        vehiculos2 
    });
    
   /*
   const token = await fetch("http://35.193.70.253/GetToken?client_id=123456789123456789&password=subastas123**", {
    method: "get",
    headers: { "Content-Type": "application/json" },
    timeout: 3000,
    })
    .then((res) => res.json())
    .catch(function (err) {
    return res
        .status(500)
        .json({ estado: 500, mensaje: "Tiempo de respuesta exedido." });
    });

    if(!token){
        return res.status(401).json({
            auth: false,
            mensaje: 'No hay Token'
        });
    }

    const URL=URL_SERVER+"vehiculo?jwt="+token.token;
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
    */
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
    new_imagen.foto = 'http://34.70.210.93/img/'+req.file.originalname;
    new_imagen.estado = req.body.foto1_e;
    await new_imagen.save();

    req.flash('succes_msg', 'Imagen Subida Con Exito');
    res.redirect('/vehiculos/all');
});

router.get('/vehiculos/ver/:id', async(req, res) => {
    
    const galeria = await VehiculoGaleria.find({id_vehiculo: req.params.id}).sort({date:'desc'})
    const galeria2=[];

    const vehiculos = await Vehiculo.find({_id: req.params.id}).sort({date:'desc'})
    const vehiculos2=[];
    
    for(var v in vehiculos){
        vehiculos2.push({
            _id: vehiculos[v]._id, tipo:vehiculos[v].tipo, marca:vehiculos[v].marca,
            linea:vehiculos[v].linea, modelo:vehiculos[v].modelo, placa:vehiculos[v].placa,
            chasis:vehiculos[v].chasis, motor:vehiculos[v].motor, color:vehiculos[v].color,
            direccion: vehiculos[v].direccion, precio_base: vehiculos[v].precio_base,
            minimo_requerido: vehiculos[v].minimo_requerido, id_aseguradora: vehiculos[v].id_aseguradora,
            nombre_estado: vehiculos[v].nombre_estado
        });
    }

    for(var g in galeria){
        galeria2.push({
            foto: galeria[g].foto
        });
    }
    
    res.render('vehiculos/see_vehiculos.hbs', { 
        vehiculos2,
        galeria2 
    });
    /*
    const token = await fetch("http://35.193.70.253/GetToken?client_id=123456789123456789&password=subastas123**", {
    method: "get",
    headers: { "Content-Type": "application/json" },
    timeout: 3000,
    })
    .then((res) => res.json())
    .catch(function (err) {
    return res
        .status(500)
        .json({ estado: 500, mensaje: "Tiempo de respuesta exedido." });
    });

    if(!token){
        return res.status(401).json({
            auth: false,
            mensaje: 'No hay Token'
        });
    }

    const id_vehiculo=req.params.id;
    const URL_GALERIA = URL_SERVER+"foto?id="+id_vehiculo+'&jwt='+token.id;
    const URL_VEHICULOS=URL_SERVER+"vehiculo?id="+id_vehiculo+"&jwt="+token.id;
    
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
            .json({ estado: 500, mensaje: "Fallo en Recepcion de Vehiculo" });
        })

    )
    .catch(function (err) {
      return res
        .status(500)
        .json({ estado: 500, mensaje: "Fallo Recepcion de Galeria de Fotos" });
    });
    */

});

router.delete('/vehiculos/delete/:id', async(req, res) => {
    await Vehiculo.findByIdAndDelete(req.params.id);
    req.flash('succes_msg','Se A eliminado Vehiculo');
    res.redirect('/vehiculos/all');
});

router.get('/vehiculos/nuevo_estado', (req, res) => {
    res.render('vehiculos/new_estado.hbs');
});

router.post('/vehiculos/creando_estado', async(req, res) => {
    
    const{ id, nombre, subastable} = req.body;
    const errors=[];
    
    if(errors.length>0){
        res.render('vehiculos/new_vehiculo.hbs', {
            errors
        });
    }else{
        const new_estado = new Estado();
        new_estado.id = id;
        new_estado.nombre = nombre;
        new_estado.subastable=subastable;
        await new_estado.save();
        req.flash('succes_msg', 'Estado Agregado con Exito');
        res.redirect('/vehiculos/all');
    }
});

router.get('/vehiculos/all_inventario',  async(req, res) => {
    
    const vehiculos = await Vehiculo.find({id_aseguradora: globalAseguradora});
    const vehiculos2=[];
    
    for(var v in vehiculos){
        vehiculos2.push({
            _id: vehiculos[v]._id, tipo:vehiculos[v].tipo, marca:vehiculos[v].marca,
            linea:vehiculos[v].linea, modelo:vehiculos[v].modelo, placa:vehiculos[v].placa,
            chasis:vehiculos[v].chasis, motor:vehiculos[v].motor, color:vehiculos[v].color,
            direccion: vehiculos[v].direccion, id_aseguradora:vehiculos[v].id_aseguradora,
            nombre_estado: vehiculos[v].nombre_estado
            });
    }
    res.render('vehiculos/all_vehiculos_inventario.hbs', { 
        vehiculos2 
    });
    
});

router.get('/vehiculos/cambio_estado1/:id', async(req, res) => {
    
    const vehiculo=await Vehiculo.findById(req.params.id);
    vehiculo.estado=1;
    vehiculo.nombre_estado="Tránsito";
    vehiculo.subastable=false;
    await vehiculo.save();

    req.flash('succes_msg','Cambio a Estado Tránsito');
    res.redirect('/vehiculos/all');
});

router.get('/vehiculos/cambio_estado2/:id', async(req, res) => {
    
    const vehiculo=await Vehiculo.findById(req.params.id);
    vehiculo.estado=2;
    vehiculo.nombre_estado="Almacenaje";
    vehiculo.subastable=true;
    await vehiculo.save();

    req.flash('succes_msg','Cambio a Estado Almacenaje');
    res.redirect('/vehiculos/all');
});

router.get('/vehiculos/cambio_estado3/:id', async(req, res) => {
    
    const vehiculo=await Vehiculo.findById(req.params.id);
    vehiculo.estado=3;
    vehiculo.nombre_estado="Subastable";
    vehiculo.subastable=true;
    await vehiculo.save();

    req.flash('succes_msg','Cambio a Estado Subastable');
    res.redirect('/vehiculos/all');
});

router.get('/vehiculos/cambio_estado4/:id', async(req, res) => {
    
    const vehiculo=await Vehiculo.findById(req.params.id);
    vehiculo.estado=4;
    vehiculo.nombre_estado="Adjudicado";
    vehiculo.subastable=false;
    await vehiculo.save();

    req.flash('succes_msg','Cambio a Estado Adjudicado');
    res.redirect('/vehiculos/all');
});

router.get('/vehiculos/cambio_estado5/:id', async(req, res) => {
    
    const vehiculo=await Vehiculo.findById(req.params.id);
    vehiculo.estado=5;
    vehiculo.nombre_estado="Vendido";
    vehiculo.subastable=false;
    await vehiculo.save();

    req.flash('succes_msg','Cambio a Estado Vendido');
    res.redirect('/vehiculos/all');
});

//************       Metodos de Servicio     ******************************/

//Parametros [jwt:,id?,placa?,estado?]
router.get('/vehiculo', async(req, res) => {
    
    if(!req.query.jwt){
        res.send('El JWT no es válido o no contiene el scope de este servicio').status(403);
    }

    //Validacion del Toquen
    const validaToken=true;
    const token=req.query.jwt;
    jwt.verify(token, KEY, (err, data) => {
        if(err){
            console.log('El JWT no es válido');
            alidaToken=false;
            res.send('El JWT no es válido').status(403);
            
        }     
    });

    if(validaToken){

        let consulta = {};
        if(req.query.id){
            consulta._id=req.query.id;
        }
        if(req.query.placa){
            consulta.placa=req.query.placa;
        }
        if(req.query.estado){
            consulta.estado=req.query.estado;
        }
    
        const vehiculos = await Vehiculo.find(consulta).sort({date:'desc'});
        const retorno=JSON.stringify({response:vehiculos});
        console.log(retorno);
        res.send(retorno).status(200);
    }

});//Sirve arreglo de vehiculos

//Parametros [jwt:,id?,externa?]
router.get('/foto', async(req, res) => {

    
    if(!req.query.jwt){
        res.send('El JWT no es válido o no contiene el scope de este servicio').status(403);
    }

    //Validacion del Toquen
    const validaToken=true;
    const token=req.query.jwt;
    jwt.verify(token, KEY, (err, data) => {
        if(err){
            console.log('El JWT no es válido');
            alidaToken=false;
            res.send('El JWT no es válido').status(403);
            
        }     
    });
    
    if(validaToken){
        let consulta = {};
        if(req.query.id){
            consulta.id_vehiculo=req.query.id;
        }
        if(req.query.externa){
            consulta.estado=req.query.externa;
        }

        const fotos = await VehiculoGaleria.find(consulta);
        const fotos_retorno=[];
        
        for(var f in fotos){
            fotos_retorno.push({
                id: fotos[f]._id, url:fotos[f].foto
                });
        }

        const retorno=JSON.stringify({response:fotos_retorno});
        console.log(fotos_retorno);
        res.send(retorno).status(200);
    }

});//Sirve Fotos

//Parametros [jwt:,id?]
router.get('/estado', async(req, res) => {

    
    if(!req.query.jwt){
        res.send('El JWT no es válido o no contiene el scope de este servicio').status(403);
    }

    //Validacion del Toquen
    const validaToken=true;
    const token=req.query.jwt;
    jwt.verify(token, KEY, (err, data) => {
        if(err){
            console.log('El JWT no es válido');
            alidaToken=false;
            res.send('El JWT no es válido').status(403);
            
        }     
    });

    if(validaToken){
        const idd=req.query.id;
  
        let consulta = {};
        if(idd){
            consulta.id=idd;
        }

        const estado = await Estado.find(consulta);
        //console.log(estado);
        const estado_retorno=[];
        
        for(var e in estado){
            estado_retorno.push({
                id: estado[e].id, nombre:estado[e].nombre, subastable: estado[e].subastable
                });
        }

        res.send(estado_retorno).status(200);
    }

});//Sirve Estados

router.put('/vehiculo', async(req, res) => {

    //console.log(req.body);

    if(!req.body.jwt){
        res.send('El JWT no es válido o no contiene el scope de este servicio').status(403);
    }

    //Validacion del Toquen
    const validaToken=true;
    const token=req.body.jwt;
    jwt.verify(token, KEY, (err, data) => {
        if(err){
            console.log('El JWT no es válido');
            alidaToken=false;
            res.send('El JWT no es válido').status(403);
            
        }     
    });

    if(validaToken){
        const id=req.body.id;
        const estado=req.body.estado;
        const afiliado_adjudicado=req.body.afiliado_adjudicado;
        const valor_adjudicacion=req.body.valor_adjudicacion;

        if(!id){
            res.send('ID del vehiculo No Especificado').status(404);
        }
        console.log(estado);
        if(estado!='1' && estado!='2' && estado!='3' && estado!='4' && estado!='5'){
            res.send('ID Estado no Existe').status(404);
        }
        
        const vehiculoBuscado=await Vehiculo.find({_id: id});
        if(!vehiculoBuscado){
            res.send('ID del vehiculo No Existe').status(404);
        }
        if(!afiliado_adjudicado&&!valor_adjudicacion){
            res.send('No Existe Valor Adjudicado ni afiliado adjudicado').status(406);
        }
        const nombre_estado='';
        if(estado=='1'){
            nombre_estado='Transito';
        }
        if(estado=='2'){
            nombre_estado='Almacenaje';
        }
        if(estado=='3'){
            nombre_estado='Subastable';
        }
        if(estado=='4'){
            nombre_estado='Adjudicado';
        }
        if(estado=='5'){
            nombre_estado='Vendido';
        }

        await Vehiculo.findByIdAndUpdate(id, {estado: estado, valor_adjudicacion: valor_adjudicacion, afiliado_adjudicado:afiliado_adjudicado, nombre_estado: nombre_estado});
        const objretorno={};
        objretorno.respuesta=true;
        res.send(true).status(200);
    }   

});

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

router.get('/vertoken', async(req, res) => {

    const x = await fetch("http://35.193.70.253/GetToken?client_id=123456789123456789&password=subastas123**", {
        method: "get",
        headers: { "Content-Type": "application/json" },
        timeout: 3000,
    })
    .then((res) => res.json())
    .catch(function (err) {
      return res
        .status(500)
        .json({ estado: 500, mensaje: "Tiempo de respuesta exedido." });
    });
    
}); 

router.put('/rutita', async(req, res) => {

    console.log(req.body);
    const x=JSON.stringify({ x: 5, y: 6 });

    res.json({
        x
    }).status(200);
});

module.exports = router;