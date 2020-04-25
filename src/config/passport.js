const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const fetch = require('node-fetch');

const User = require('../models/User'); 
const URL_SERVER='http://localhost:3001/';

passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  
  
  // Match Email's User
  const user = await User.findOne({email: email});
  if (!user) {
    return done(null, false, { message: 'Not User found.' });
  } else {
    // Match Password's User
    const match = await user.matchPassword(password);
    if(match) {
      globalUser=user._id; 
      return done(null, user);
    } else {
      return done(null, false, { message: 'Incorrect Password.' });
    }
  }
  

  /*
      //console.log(email+"::::::"+password);
      const URL=URL_SERVER+"afiliado?jwt=asd"+"&codigo="+email+"&password="+password;
      const datos=await fetch(URL, {
          method: "get",
          headers: { "Content-Type": "application/json" },
          timeout: 3000,
      })
      .then((res) => res.json())
      .catch(function (err) {
      });

      if(!datos){
        console.log('Falla En Autenticacion');
        return done(null, false, { message: 'Falla En Autenticacion' });
      }else{
        if(datos[0].rol!="ajustador"){
          console.log('Falla En Autenticacion Usuario debe ser Ajustador');
          return done(null, false, { message: 'Falla En Autenticacion Usuario debe ser Ajustador' });
        }else{
          console.log('Entra');
                const user = await User.findOne({email: 're4lawliet@gmail.com'});
                if (!user) {
                  return done(null, false, { message: 'Not User found.' });
                } else {
                  // Match Password's User
                  const match = await user.matchPassword('123456');
                  if(match) {      
                    //console.log('Entra');
                    globalUser=datos[0]._id; 
                    return done(null, user);
                  } else {
                    return done(null, false, { message: 'Incorrect Password.' });
                  }
                }
        }
      }
      */
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});