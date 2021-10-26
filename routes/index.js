const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isNotLoggedIn } = require('../lib/auth');

router.get('/', async (req, res) => {
    res.render('index');
});

router.get('/sizes', async (req, res) => {
    const sizes = await pool.query('SELECT * FROM TALLA');
    res.json({
        sizes
    })
});

router.get('/slider', async (req, res) => {
    const slider = await pool.query('SELECT * FROM SLIDER WHERE SLIDER_ESTADO = "ACTIVO"');
    res.json({
        slider
    })
})

router.get('/autocompleteName', async (req, res) => {
    const autocompleteName = await pool.query('SELECT PRODUCTO_NOMBRE FROM PRODUCTO WHERE PRODUCTO_ESTADO = "ACTIVO"');
    res.json({
        autocompleteName
    })
});

// router.get('/autocompleteName', async (req, res) => {
//     const products = await pool.query('SELECT PRODUCTO_NOMBRE FROM PRODUCTO');
//     res.json({
//         products
//     })
// });

module.exports = router;