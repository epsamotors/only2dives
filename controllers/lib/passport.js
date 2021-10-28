const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');//Llamamos a la base

// //SINGIN
passport.use('local.signin', new LocalStrategy({//Esto es para el login
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {

    const rows = await pool.query('SELECT * FROM PERSONA WHERE PERSONA_CORREO = ?', [email]);

    if (rows.length > 0) {//Si el usuario existe, valido su contraseña
        const user = rows[0];

        if (user.PERSONA_ESTADO == 'ELIMINADO' || user.PERSONA_ESTADO == 'POR_APROBAR') {
            return done(null, false, req.flash('message', 'Su cuenta está desactivada'));
        }

        if (user.PERSONA_CORREO == email && user.PERSONA_CONTRASENA == password) {
            done(null, user);
        } else {//Si la contraseña es invalida
            done(null, false, req.flash('message', 'Contraseña Incorrecta'));
        }

    } else {
        return done(null, false, req.flash('message', 'El usuario ' + email + ' no existe'));
    }
}));

passport.serializeUser((user, done) => {//Esto permite almacenar en sesion
    done(null, user.PERSONA_ID);
});

passport.deserializeUser(async (PERSONA_ID, done) => {
    const rows = await pool.query('SELECT * FROM PERSONA WHERE PERSONA_ID = ?', [PERSONA_ID]);
    done(null, rows[0]);
});