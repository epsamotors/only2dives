const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../lib/auth');

const {
    getAllProducts,
    getSearchProducts,
    getCategoryProducts,
    getDetailProducts,
    addToCart,
    getCart,
    deleteInCart,
    maxInCart,
    minInCart,
    deleteCart,
    // buyCart,
    checkout,
    errorCart
} = require('../controllers/store');

router.get('/shop', getAllProducts);
router.get('/search', getSearchProducts);
router.get('/category', getCategoryProducts);

router.get('/detail/:producto_id', getDetailProducts);

router.post('/shop', addToCart);
router.get('/cart', isLoggedIn, getCart);
router.post('/cart', isLoggedIn, deleteInCart);

router.post('/cart/max', isLoggedIn, maxInCart);
router.post('/cart/min', isLoggedIn, minInCart);

router.post('/cart/delete', isLoggedIn, deleteCart);
router.post('/cart/buy', isLoggedIn, checkout);
// router.post('/cart/checkout', isLoggedIn, checkout);
router.get('/cart/errorbuy', isLoggedIn, errorCart);

// router.get('/edit/:producto_id', isLoggedIn, editProductPage);
// router.post('/edit/:producto_id', isLoggedIn, validate(editProductsValidation), editProductPost);

module.exports = router;