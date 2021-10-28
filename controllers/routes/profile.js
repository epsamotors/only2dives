const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('../lib/auth');

const {
    getDateProducts,
    getAllDateBuy,
    editPeoplePost,
    commentProduct
} = require('../controllers/profile');

router.get('/', isLoggedIn, getDateProducts);
router.post('/detail', isLoggedIn, getAllDateBuy);

// Editar Persona
// router.post('/user', isLoggedIn, validate(editUsersValidation), editPeoplePost);
router.post('/user', isLoggedIn, editPeoplePost);
router.post('/comment', isLoggedIn, commentProduct);

module.exports = router;