const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('../lib/auth');

const {
    getAllProducts,
    editPeoplePost,
    commentProduct
} = require('../controllers/profile');

router.get('/', isLoggedIn, getAllProducts);

// Editar Persona
// router.post('/user', isLoggedIn, validate(editUsersValidation), editPeoplePost);
router.post('/user', isLoggedIn, editPeoplePost);
router.post('/comment', isLoggedIn, commentProduct);

module.exports = router;