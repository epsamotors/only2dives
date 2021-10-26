const pool = require('../database');

module.exports = {

    getAllProducts: async (req, res) => {
        const { PERSONA_ID } = req.user;
        const people = await pool.query('SELECT * FROM PERSONA WHERE PERSONA.PERSONA_ID = ?', [req.user.PERSONA_ID]);
        const profile = people[0];

        const products = await pool.query('SELECT * FROM DETALLE_VENTA, PRODUCTO, PERSONA, VENTA WHERE DETALLE_VENTA.VENTA_ID = VENTA.VENTA_ID AND PERSONA.PERSONA_ID = VENTA.PERSONA_ID AND PRODUCTO.PRODUCTO_ID = DETALLE_VENTA.PRODUCTO_ID AND PERSONA.PERSONA_ID = ?', [PERSONA_ID]);

        res.render('profile/list', { profile, products });
    },

    editPeoplePost: async (req, res) => {
        const { PERSONA_ID } = req.user;

        const rows = await pool.query('SELECT * FROM PERSONA WHERE PERSONA_ID = ?', [PERSONA_ID]);
        const profile = rows[0];

        const { ROL_ID, PERSONA_NOMBRE, PERSONA_CORREO, NUEVA_CONTRASENA, PERSONA_CONTRASENA, PERSONA_ESTADO } = req.body;

        const newUser = {
            ROL_ID,
            PERSONA_NOMBRE,
            PERSONA_CORREO,
            PERSONA_CONTRASENA,
            PERSONA_ESTADO,
        }

        console.log(newUser);

        newUser.PERSONA_NOMBRE = newUser.PERSONA_NOMBRE.toUpperCase();
        newUser.ROL_ID = profile.ROL_ID;
        newUser.PERSONA_CORREO = profile.PERSONA_CORREO;
        newUser.PERSONA_ESTADO = profile.PERSONA_ESTADO;

        if (NUEVA_CONTRASENA) {
            newUser.PERSONA_CONTRASENA = NUEVA_CONTRASENA;
        } else {
            newUser.PERSONA_CONTRASENA = profile.PERSONA_CONTRASENA;
        }

        console.log(newUser);
        await pool.query('UPDATE PERSONA set ? WHERE PERSONA_ID = ?', [newUser, PERSONA_ID]);
        // req.flash('success', 'Usuario Modificado');
        res.redirect('/profile');
    },

    commentProduct: async (req, res) => {

        const { PRODUCTO_ID, COMENTARIO_DESCRIPCION, COMENTARIO_CALIFICACION, COMENTARIO_ESTADO } = req.body;

        const newComment = {
            PRODUCTO_ID,
            PERSONA_ID: req.user.PERSONA_ID,
            COMENTARIO_DESCRIPCION,
            COMENTARIO_CALIFICACION,
            COMENTARIO_ESTADO
        }

        newComment.COMENTARIO_DESCRIPCION = newComment.COMENTARIO_DESCRIPCION.toUpperCase();
        newComment.COMENTARIO_ESTADO = 'ACTIVO';

        console.log(newComment);

        await pool.query('INSERT INTO COMENTARIO set ?', [newComment]);
        // req.flash('success', 'Imagen Comentada');
        res.redirect('/profile');
    }

}