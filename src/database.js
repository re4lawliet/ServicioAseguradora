const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/bd1',{
    
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
    useCreateIndex: true,
    useFindAndModify: false
    
})
  .then(db => console.log("Base de Datos Conectada"))
  .catch(err => console.error(err));