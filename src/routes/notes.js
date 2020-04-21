// Rutas de usuario
const express = require('express');
const router =  express.Router();

const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth');

//Funcion para lanzar formulariode Nueva Nota
router.get('/notas/nueva-nota', isAuthenticated, (req, res) => {
    res.render('notes/new_note.hbs');
});

//Funcion para enviar datos de nueva nota [POST]
router.post('/notas/crear', isAuthenticated, async(req, res) => {
    
    const{ title, description } = req.body;
    const errors=[];

    if(!title){
        errors.push({text:'Porfavor escriba el titulo'});
    }
    if(!description){
        errors.push({text:'Porfavor escriba la descripcion',});
    }

    if(errors.length>0){
        res.render('notes/new_note.hbs', {
            errors,
            title,
            description
        });
    }else{
        const newnote = new Note({title,description});
        newnote.user = req.user.id;
        await newnote.save();
        req.flash('succes_msg', 'Agregado con Exito');
        res.redirect('/notas/notas');
    }
});
router.get('/notas/notas',isAuthenticated, async(req, res) => {
    const notes = await Note.find({user: req.user.id}).sort({date:'desc'})

    const notes2=[];

    for(var title in notes){
        notes2.push({text: notes[title].title, text2: notes[title].description, text3: notes[title]._id});
    }
    res.render('notes/all-notes.hbs', { 
        notes,
        notes2 
    });
});

router.get('/notas/edit/:id', isAuthenticated, async(req, res) => {
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