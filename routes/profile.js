const { Router } = require('express');
const router = Router();

const pool = require('../database');

const { isLoggedIn } = require('../lib/auth');

const {
    getDateProducts,
    getAllDateBuy,
    editPeoplePost,
    commentProduct
} = require('../controllers/profile');

router.get('/', isLoggedIn, getDateProducts);
router.post('/detail', isLoggedIn, getAllDateBuy);

router.get('/productsBuy', isLoggedIn, async (req, res) => {
    const { PERSONA_ID } = req.user;
    const productsBuy = await pool.query('SELECT * FROM VENTA WHERE PERSONA_ID = ?', [PERSONA_ID]);
    res.json({
        productsBuy
    })
})

// Editar Persona
// router.post('/user', isLoggedIn, validate(editUsersValidation), editPeoplePost);
router.post('/user', isLoggedIn, editPeoplePost);
router.post('/comment', isLoggedIn, commentProduct);

module.exports = router;