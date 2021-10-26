const pool = require('../database');

module.exports = {

    createUserPage: async (req, res) => {
        res.render('auth/signup');
    },

    createUserPost: async (req, res, cb) => { // Creamos nuevo usuario
        console.log(req.body);

        const { DIRECCION_ID, ROL_ID, PERSONA_APELLIDO, PERSONA_NOMBRE, PERSONA_NACIONALIDAD, PERSONA_DNI, PERSONA_TELEFONO, PERSONA_DIRECCION, PERSONA_CORREO, PERSONA_CONTRASENA, PERSONA_ESTADO } = req.body;
        const rows = await pool.query('SELECT * FROM PERSONA WHERE PERSONA_CORREO = ?', [PERSONA_CORREO]);

        if (rows.length > 0) {
            req.flash('message', 'El correo ' + PERSONA_CORREO + ' ya existe');
            res.redirect('/signup');
        } else {
            const newUser = {
                DIRECCION_ID,
                ROL_ID,
                PERSONA_APELLIDO,
                PERSONA_NOMBRE,
                PERSONA_NACIONALIDAD,
                PERSONA_DNI,
                PERSONA_TELEFONO,
                PERSONA_DIRECCION,
                PERSONA_CORREO,
                PERSONA_CONTRASENA,
                PERSONA_ESTADO
            }

            newUser.ROL_ID = 2;
            newUser.PERSONA_APELLIDO = newUser.PERSONA_APELLIDO.toUpperCase();
            newUser.PERSONA_NOMBRE = newUser.PERSONA_NOMBRE.toUpperCase();
            newUser.PERSONA_NACIONALIDAD = newUser.PERSONA_NACIONALIDAD.toUpperCase();
            newUser.PERSONA_DIRECCION = newUser.PERSONA_DIRECCION.toUpperCase();
            newUser.PERSONA_ESTADO = 'Activo';

            console.log(newUser);
            await pool.query('INSERT INTO PERSONA SET ?', [newUser]);
            req.flash('success', 'Cuenta creada con exito');

            res.redirect('/shop');
        }
    }
}