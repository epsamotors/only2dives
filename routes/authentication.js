const { Router } = require('express');
const router = Router();

const passport = require('passport');//Traemos la biblioteca de passport

const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');//Lo ejecutamos en culquier ruta que queramos proteger

const { validate,
    loginValidation
} = require('../lib/validation');

const Cart = require('../models/cart');

const {
    createUserPage,
    createUserPost,
} = require('../controllers/authentication');

router.get('/signup', isNotLoggedIn, createUserPage);
// router.post('/signup', isNotLoggedIn, validate(createUsersValidation), createUserPost);
router.post('/signup', isNotLoggedIn, createUserPost);//Enviar datos a la base

// router.post('/signin', isNotLoggedIn, validate(loginValidation), passport.authenticate('local.signin', {
router.post('/signin', isNotLoggedIn, passport.authenticate('local.signin', {
    successRedirect: '/shop',
    failureRedirect: '/',
    failureFlash: true
}));


// Salir de sesión
router.get('/logout', isLoggedIn, (req, res) => {
    const idUser = req.user.PERSONA_ID;
    Cart.deleteCart(idUser);
    req.logOut();
    res.redirect('/')
});

module.exports = router;