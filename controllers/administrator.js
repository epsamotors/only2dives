
const pool = require('../database');

module.exports = {

    //---------------------------------------------------------------
    // Listamos Ropa
    //---------------------------------------------------------------

    getAllProducts: async (req, res) => {
        const products = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO_ESTADO = "ACTIVO"');
        res.render('administrator/list', { products });
    },

    //---------------------------------------------------------------
    // Ropa
    //---------------------------------------------------------------

    createProductPage: async (req, res) => {
        const category = await pool.query('SELECT * FROM CATEGORIA WHERE CATEGORIA_ESTADO = "ACTIVO"');
        res.render('administrator/addProduct', { category });
    },

    createProductPost: async (req, res) => {

        var today = new Date();
        const productDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

        const { CATEGORIA_ID, TALLA_ID, PRODUCTO_NOMBRE, PRODUCTO_CODIGO, PRODUCTO_MEDIDAS, PRODUCTO_DESCRIPCION, PRODUCTO_PRECIO, PRODUCTO_STOCK, PRODUCTO_FECHAALTA, PRODUCTO_FECHABAJA, PRODUCTO_URL, PRODUCTO_ESTADO } = req.body;

        const newProduct = {
            CATEGORIA_ID,
            TALLA_ID,
            PRODUCTO_NOMBRE,
            PRODUCTO_CODIGO,
            PRODUCTO_MEDIDAS,
            PRODUCTO_DESCRIPCION,
            PRODUCTO_PRECIO,
            PRODUCTO_STOCK,
            PRODUCTO_FECHAALTA,
            PRODUCTO_FECHABAJA,
            PRODUCTO_URL,
            PRODUCTO_ESTADO
        };

        newProduct.PRODUCTO_ESTADO = 'ACTIVO';
        newProduct.PRODUCTO_NOMBRE = newProduct.PRODUCTO_NOMBRE.toUpperCase();
        newProduct.PRODUCTO_DESCRIPCION = newProduct.PRODUCTO_DESCRIPCION.toUpperCase();
        newProduct.PRODUCTO_MEDIDAS = newProduct.PRODUCTO_MEDIDAS.toUpperCase();
        newProduct.PRODUCTO_FECHAALTA = productDate;

        try {
            if (req.file.filename) {
                newProduct.PRODUCTO_URL = await process.env.GALLERY_URL + req.file.filename;
            }
        } catch {
            newProduct.PRODUCTO_URL = await process.env.GALLERY_DEFAULT;
        }

        console.log(newProduct);
        // console.log(req.file);

        await pool.query('INSERT INTO PRODUCTO set ?', [newProduct]);

        // const row = await pool.query('SELECT MAX(PRODUCTO_ID) AS ID FROM PRODUCTO');
        // const lastId = row[0];
        // const lastProduct = lastId.ID;

        // const newColor = {
        //     PRODUCTO_ID: lastProduct,
        //     COLOR_CODIGO,
        //     COLOR_ESTADO
        // };

        // await pool.query('INSERT INTO COLOR set ?', [newColor]);

        // req.flash('success', 'Producto Agregado');//Almacenamos el mensaje en success
        res.redirect('/administrator');//redirecciona a la ruta products
    },

    editProductPage: async (req, res) => {
        const { producto_id } = req.params;

        const products = await pool.query('SELECT * FROM PRODUCTO, CATEGORIA WHERE CATEGORIA.CATEGORIA_ID = PRODUCTO.CATEGORIA_ID AND PRODUCTO.PRODUCTO_ID = ?', [producto_id]);

        const gallery = await pool.query('SELECT * FROM GALERIA WHERE GALERIA_ESTADO = "ACTIVO" AND GALERIA.PRODUCTO_ID = ?', [producto_id]);

        const listcategory = await pool.query('SELECT * FROM CATEGORIA WHERE CATEGORIA_ESTADO = "ACTIVO" AND CATEGORIA.CATEGORIA_ID NOT IN (SELECT CATEGORIA_ID FROM PRODUCTO WHERE PRODUCTO_ID = ?)', [producto_id]);

        res.render('administrator/editProduct', { product: products[0], gallery, listcategory });
    },

    editProductPost: async (req, res) => {
        const { producto_id } = req.params;

        const rows = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO_ID = ?', [producto_id]);
        const products = rows[0];

        const { CATEGORIA_ID, TALLA_ID, PRODUCTO_NOMBRE, PRODUCTO_CODIGO, PRODUCTO_MEDIDAS, PRODUCTO_DESCRIPCION, PRODUCTO_PRECIO, PRODUCTO_STOCK, PRODUCTO_FECHAALTA, PRODUCTO_FECHABAJA, PRODUCTO_URL, PRODUCTO_ESTADO } = req.body;

        const newProduct = {
            CATEGORIA_ID,
            TALLA_ID,
            PRODUCTO_NOMBRE,
            PRODUCTO_CODIGO,
            PRODUCTO_MEDIDAS,
            PRODUCTO_DESCRIPCION,
            PRODUCTO_PRECIO,
            PRODUCTO_STOCK,
            PRODUCTO_FECHAALTA,
            PRODUCTO_FECHABAJA,
            PRODUCTO_URL,
            PRODUCTO_ESTADO
        };

        console.log(newProduct);
        newProduct.PRODUCTO_NOMBRE = newProduct.PRODUCTO_NOMBRE.toUpperCase();
        newProduct.PRODUCTO_MEDIDAS = newProduct.PRODUCTO_MEDIDAS.toUpperCase();
        newProduct.PRODUCTO_DESCRIPCION = newProduct.PRODUCTO_DESCRIPCION.toUpperCase();
        newProduct.PRODUCTO_FECHAALTA = products.PRODUCTO_FECHAALTA;
        newProduct.PRODUCTO_ESTADO = products.PRODUCTO_ESTADO;

        if (TALLA_ID == 0) {
            newProduct.TALLA_ID = products.TALLA_ID;
        }

        try {
            if (req.file.filename) {
                newProduct.PRODUCTO_URL = await process.env.GALLERY_URL + req.file.filename;
            }
        } catch {
            newProduct.PRODUCTO_URL = products.PRODUCTO_URL;
        }

        console.log(newProduct);

        await pool.query('UPDATE PRODUCTO set ? WHERE PRODUCTO_ID = ?', [newProduct, producto_id]);






        res.redirect('/administrator');
    },


    deleteProduct: async (req, res) => {
        const { producto_id } = req.params;

        var today = new Date();
        const productDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
        console.log(productDate);

        await pool.query('UPDATE PRODUCTO SET PRODUCTO_ESTADO = "ELIMINADO" WHERE PRODUCTO.PRODUCTO_ID = ?', [producto_id]);
        await pool.query('UPDATE PRODUCTO SET PRODUCTO_FECHABAJA = ? WHERE PRODUCTO.PRODUCTO_ID = ?', [productDate, producto_id]);

        // req.flash('success', 'Producto Eliminado');
        res.redirect('/administrator');//redireccionamos a la misma lista products
    },

    //---------------------------------------------------------------
    // Galeria
    //---------------------------------------------------------------

    createImagePost: async (req, res) => {

        const { PRODUCTO_ID, GALERIA_NOMBRE, GALERIA_DESCRIPCION, GALERIA_URL, GALERIA_ESTADO } = req.body;

        const newGallery = {
            PRODUCTO_ID,
            GALERIA_NOMBRE,
            GALERIA_DESCRIPCION,
            GALERIA_URL,
            GALERIA_ESTADO
        };

        newGallery.GALERIA_ESTADO = 'ACTIVO';

        try {
            if (req.file.filename) {
                newGallery.GALERIA_URL = await process.env.GALLERY_URL + req.file.filename;
            }
        } catch {
            newGallery.GALERIA_URL = await process.env.GALLERY_DEFAULT;
        }

        console.log(newGallery);

        await pool.query('INSERT INTO GALERIA set ?', [newGallery]);

        res.redirect('/administrator');//redirecciona a la ruta products
    },

    updateImagePost: async (req, res) => {
        const { galeria_id } = req.params;

        const rows = await pool.query('SELECT * FROM GALERIA WHERE GALERIA_ID = ?', [galeria_id]);
        const galeria = rows[0];

        const { PRODUCTO_ID, GALERIA_NOMBRE, GALERIA_DESCRIPCION, GALERIA_URL, GALERIA_ESTADO } = req.body;

        const newGallery = {
            PRODUCTO_ID,
            GALERIA_NOMBRE,
            GALERIA_DESCRIPCION,
            GALERIA_URL,
            GALERIA_ESTADO
        };

        newGallery.GALERIA_ESTADO = galeria.GALERIA_ESTADO;
        newGallery.PRODUCTO_ID = galeria.PRODUCTO_ID;

        try {
            if (req.file.filename) {
                newGallery.GALERIA_URL = await process.env.GALLERY_URL + req.file.filename;
            }
        } catch {
            newGallery.GALERIA_URL = galeria.GALERIA_URL;
        }

        console.log(newGallery);

        await pool.query('UPDATE GALERIA set ? WHERE GALERIA_ID = ?', [newGallery, galeria_id]);

        // req.flash('success', 'Producto Agregado');//Almacenamos el mensaje en success
        res.redirect('/administrator');//redirecciona a la ruta products
    },

    deleteImagePost: async (req, res) => {
        const { galeria_id } = req.params;

        await pool.query('UPDATE GALERIA SET GALERIA_ESTADO = "ELIMINADO" WHERE GALERIA.GALERIA_ID = ?', [galeria_id]);

        // req.flash('success', 'Producto Eliminado');
        res.redirect('/administrator');//redireccionamos a la misma lista products
    },

    //---------------------------------------------------------------
    // CATEGORIA
    //---------------------------------------------------------------

    listCategory: async (req, res) => {

        const category = await pool.query('SELECT * FROM CATEGORIA WHERE CATEGORIA_ESTADO = "ACTIVO"');

        res.render('administrator/category', { category });
    },

    createCategoryPost: async (req, res) => {

        const { CATEGORIA_NOMBRE, CATEGORIA_DESCRIPCION, CATEGORIA_ESTADO } = req.body;

        const newCategory = {
            CATEGORIA_NOMBRE,
            CATEGORIA_DESCRIPCION,
            CATEGORIA_ESTADO
        };

        newCategory.CATEGORIA_NOMBRE = newCategory.CATEGORIA_NOMBRE.toUpperCase();
        // newCategory.CATEGORIA_DESCRIPCION = newCategory.CATEGORIA_DESCRIPCION.toUpperCase();
        newCategory.CATEGORIA_ESTADO = 'ACTIVO';

        console.log(newCategory);

        await pool.query('INSERT INTO CATEGORIA set ?', [newCategory]);

        req.flash('success', 'Nueva categoria agregada');//Almacenamos el mensaje en success
        res.redirect('/administrator/category');//redirecciona a la ruta products
    },

    editCategoryPost: async (req, res) => {
        const { category_id } = req.params;

        const rows = await pool.query('SELECT * FROM CATEGORIA WHERE CATEGORIA_ID = ?', [category_id]);
        const galeria = rows[0];

        const { CATEGORIA_NOMBRE, CATEGORIA_DESCRIPCION, CATEGORIA_ESTADO } = req.body;

        const newCategory = {
            CATEGORIA_NOMBRE,
            CATEGORIA_DESCRIPCION,
            CATEGORIA_ESTADO
        };

        newCategory.CATEGORIA_NOMBRE = newCategory.CATEGORIA_NOMBRE.toUpperCase();
        newCategory.CATEGORIA_DESCRIPCION = galeria.CATEGORIA_DESCRIPCION;
        newCategory.CATEGORIA_ESTADO = galeria.CATEGORIA_ESTADO;

        console.log(newCategory);

        await pool.query('UPDATE CATEGORIA set ? WHERE CATEGORIA_ID = ?', [newCategory, category_id]);
        // req.flash('success', 'Producto Actualizado');
        res.redirect('/administrator/category');
    },

    deleteCategoryPost: async (req, res) => {
        const { category_id } = req.params;

        await pool.query('UPDATE CATEGORIA SET CATEGORIA_ESTADO = "ELIMINADO" WHERE CATEGORIA.CATEGORIA_ID = ?', [category_id]);

        res.redirect('/administrator/category');//redireccionamos a la misma lista products
    },

    //---------------------------------------------------------------
    // SLIDER
    //---------------------------------------------------------------

    listSlider: async (req, res) => {
        const slider = await pool.query('SELECT * FROM SLIDER WHERE SLIDER_ESTADO = "ACTIVO"');
        res.render('administrator/slider', { slider });
    },

    addSliderPost: async (req, res) => {

        const { SLIDER_URL, SLIDER_ESTADO } = req.body;

        const newSlider = {
            SLIDER_URL,
            SLIDER_ESTADO
        };

        newSlider.SLIDER_ESTADO = 'ACTIVO';

        try {
            if (req.file.filename) {
                newSlider.SLIDER_URL = await process.env.GALLERY_URL + req.file.filename;
            }
        } catch {
            newSlider.SLIDER_URL = await process.env.GALLERY_DEFAULT;
        }

        console.log(newSlider);

        await pool.query('INSERT INTO SLIDER set ?', [newSlider]);

        req.flash('success', 'Nueva categoria agregada');

        res.redirect('/administrator/slider');
    },

    editSliderPost: async (req, res) => {
        const { slider_id } = req.params;

        const rows = await pool.query('SELECT * FROM SLIDER WHERE SLIDER_ID = ?', [slider_id]);
        const slider = rows[0];

        const { SLIDER_URL, SLIDER_ESTADO } = req.body;

        const newSlider = {
            SLIDER_URL,
            SLIDER_ESTADO
        };

        newSlider.SLIDER_ESTADO = slider.SLIDER_ESTADO;

        try {
            if (req.file.filename) {
                newSlider.SLIDER_URL = await process.env.GALLERY_URL + req.file.filename;
            }
        } catch {
            newSlider.SLIDER_URL = slider.SLIDER_URL;
        }

        console.log(newSlider);

        await pool.query('UPDATE SLIDER set ? WHERE SLIDER_ID = ?', [newSlider, slider_id]);
        // req.flash('success', 'Producto Actualizado');
        res.redirect('/administrator/slider');
    },

    deleteSliderPost: async (req, res) => {
        const { slider_id } = req.params;

        console.log(slider_id);

        await pool.query('UPDATE SLIDER SET SLIDER_ESTADO = "ELIMINADO" WHERE SLIDER.SLIDER_ID = ?', [slider_id]);

        res.redirect('/administrator/slider');//redireccionamos a la misma lista products
    },

    //---------------------------------------------------------------
    // TALLA
    //---------------------------------------------------------------

    listsize: async (req, res) => {

        const size = await pool.query('SELECT * FROM TALLA WHERE TALLA_ESTADO = "ACTIVO" ORDER BY TALLA.TALLA_TIPO ASC');
        const sizeTipe = await pool.query('SELECT DISTINCT TALLA_TIPO FROM talla WHERE TALLA_ESTADO = "ACTIVO"');

        res.render('administrator/size', { size, sizeTipe });
    },

    addSizePost: async (req, res) => {

        const { TALLA_TIPO, TALLA_NOMBRE, TALLA_ESTADO } = req.body;

        const newSize = {
            TALLA_TIPO,
            TALLA_NOMBRE,
            TALLA_ESTADO
        };

        newSize.TALLA_TIPO = newSize.TALLA_TIPO.toUpperCase();
        newSize.TALLA_NOMBRE = newSize.TALLA_NOMBRE.toUpperCase();
        newSize.TALLA_ESTADO = 'ACTIVO';

        console.log(newSize);

        await pool.query('INSERT INTO TALLA set ?', [newSize]);

        req.flash('success', 'Nueva talla agregada');//Almacenamos el mensaje en success
        res.redirect('/administrator/size');//redirecciona a la ruta products
    },

    editSizePost: async (req, res) => {
        const { size_id } = req.params;

        const rows = await pool.query('SELECT * FROM TALLA WHERE TALLA_ID = ?', [size_id]);
        const size = rows[0];

        const { TALLA_TIPO, TALLA_NOMBRE, TALLA_ESTADO } = req.body;

        const newSize = {
            TALLA_TIPO,
            TALLA_NOMBRE,
            TALLA_ESTADO
        };

        newSize.TALLA_TIPO = size.TALLA_TIPO;
        newSize.TALLA_NOMBRE = newSize.TALLA_NOMBRE.toUpperCase();
        newSize.TALLA_ESTADO = size.TALLA_ESTADO;

        console.log(newSize);

        await pool.query('UPDATE TALLA set ? WHERE TALLA_ID = ?', [newSize, size_id]);
        // req.flash('success', 'Producto Actualizado');
        res.redirect('/administrator/size');
    },

    deleteSizePost: async (req, res) => {
        const { size_id } = req.params;

        await pool.query('UPDATE TALLA SET TALLA_ESTADO = "ELIMINADO" WHERE TALLA.TALLA_ID = ?', [size_id]);

        res.redirect('/administrator/size');//redireccionamos a la misma lista products
    },

}