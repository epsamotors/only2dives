const express = require('express');
const router = express.Router();

//const { isAdmin } = require('../lib/auth');

const {
    getAllProducts,
    createProductPage,
    createProductPost,
    editProductPage,
    editProductPost,
    deleteProduct,

    createImagePost,
    updateImagePost,
    deleteImagePost,

    listCategory,
    createCategoryPost,
    deleteCategoryPost,
    editCategoryPost,

    listSlider,
    addSliderPost,
    editSliderPost,
    deleteSliderPost,

    listsize,
    addSizePost,
    editSizePost,
    deleteSizePost

} = require('../controllers/administrator');

router.get('/',   getAllProducts);

router.get('/addProduct',   createProductPage);
router.post('/addProduct',   createProductPost);
router.get('/editProduct/:producto_id',   editProductPage);
router.post('/editProduct/:producto_id',   editProductPost);
router.get('/deleteProduct/:producto_id',   deleteProduct);

router.post('/addImage',   createImagePost);
router.post('/editImage/:galeria_id',   updateImagePost);
router.get('/deleteImage/:galeria_id',   deleteImagePost);

router.get('/category',   listCategory);
router.post('/addCategory',   createCategoryPost);
router.post('/editCategory/:category_id',   editCategoryPost);
router.get('/deleteCategory/:category_id',   deleteCategoryPost);

router.get('/slider',   listSlider);
router.post('/addSlider',   addSliderPost);
router.post('/editSlider/:slider_id',   editSliderPost);
router.get('/deleteSlider/:slider_id',   deleteSliderPost);

router.get('/size',   listsize);
router.post('/addSize',   addSizePost);
router.post('/editSize/:size_id',   editSizePost);
router.get('/deleteSize/:size_id',   deleteSizePost);

module.exports = router;