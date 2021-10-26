const express = require('express');
const router = express.Router();

const { isAdmin } = require('../lib/auth');

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

router.get('/', isAdmin, getAllProducts);

router.get('/addProduct', isAdmin, createProductPage);
router.post('/addProduct', isAdmin, createProductPost);
router.get('/editProduct/:producto_id', isAdmin, editProductPage);
router.post('/editProduct/:producto_id', isAdmin, editProductPost);
router.get('/deleteProduct/:producto_id', isAdmin, deleteProduct);

router.post('/addImage', isAdmin, createImagePost);
router.post('/editImage/:galeria_id', isAdmin, updateImagePost);
router.get('/deleteImage/:galeria_id', isAdmin, deleteImagePost);

router.get('/category', isAdmin, listCategory);
router.post('/addCategory', isAdmin, createCategoryPost);
router.post('/editCategory/:category_id', isAdmin, editCategoryPost);
router.get('/deleteCategory/:category_id', isAdmin, deleteCategoryPost);

router.get('/slider', isAdmin, listSlider);
router.post('/addSlider', isAdmin, addSliderPost);
router.post('/editSlider/:slider_id', isAdmin, editSliderPost);
router.get('/deleteSlider/:slider_id', isAdmin, deleteSliderPost);

router.get('/size', isAdmin, listsize);
router.post('/addSize', isAdmin, addSizePost);
router.post('/editSize/:size_id', isAdmin, editSizePost);
router.get('/deleteSize/:size_id', isAdmin, deleteSizePost);

module.exports = router;