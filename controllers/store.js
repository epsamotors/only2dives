const pool = require('../database');
const Cart = require('../models/cart');
const stripe = require('stripe')('sk_test_51JnQDrEcCS5fMXbfMmBSxCUa0z6tOAXgLeGWcVgnNxYQtfCqmJcGaakadgHqHamcjZyxIco4dMzJ1dSexzh2aXIn00Ny24N1oK');

module.exports = {

    getAllProducts: async (req, res) => {
        var count = '0';
        try {
            if (req.user.PERSONA_ID) {
                const idUser = req.user.PERSONA_ID;
                const countProduts = Cart.getCart(idUser);
                count = countProduts.length;
            }
        } catch (error) {
            count = '0';
        }

        const products = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO_ESTADO = "ACTIVO" ORDER BY PRODUCTO.PRODUCTO_ID DESC LIMIT 8');

        const recommended = await pool.query('SELECT * FROM PRODUCTO ORDER BY PRODUCTO.PRODUCTO_ID DESC LIMIT 4');

        res.render('store/shop', { products, recommended, count });
    },

    getSearchProducts: async (req, res) => {
        var count = '0';
        try {
            if (req.user.PERSONA_ID) {
                const idUser = req.user.PERSONA_ID;
                const countProduts = Cart.getCart(idUser);
                count = countProduts.length;
            }
        } catch (error) {
            count = '0';
        }

        const { buscar } = req.query;

        var findProducts = false;

        const category = await pool.query('SELECT * FROM CATEGORIA WHERE CATEGORIA_ESTADO = "ACTIVO"');

        const products = await pool.query('SELECT * FROM PRODUCTO WHERE (INSTR(PRODUCTO_NOMBRE, ? ) > 0)', [buscar]);

        if (products.length == 0) {
            findProducts = true;
        }

        res.render('store/shopList', { products, category, findProducts, count });
    },


    getCategoryProducts: async (req, res) => {
        var count = '0';
        try {
            if (req.user.PERSONA_ID) {
                const idUser = req.user.PERSONA_ID;
                const countProduts = Cart.getCart(idUser);
                count = countProduts.length;
            }
        } catch (error) {
            count = '0';
        }

        const { CATEGORIA_ID } = req.query;
        var findProducts = false;

        const category = await pool.query('SELECT * FROM CATEGORIA WHERE CATEGORIA_ESTADO = "ACTIVO"');

        const products = await pool.query('SELECT * FROM PRODUCTO, CATEGORIA WHERE CATEGORIA.CATEGORIA_ID = PRODUCTO.CATEGORIA_ID AND CATEGORIA.CATEGORIA_ID = ?', [CATEGORIA_ID]);

        if (products.length == 0) {
            findProducts = true;
        }

        res.render('store/shopList', { products, category, findProducts, count });

    },

    getDetailProducts: async (req, res) => {
        var count = '0';
        try {
            if (req.user.PERSONA_ID) {
                const idUser = req.user.PERSONA_ID;
                const countProduts = Cart.getCart(idUser);
                count = countProduts.length;
            }
        } catch (error) {
            count = '0';
        }

        const { producto_id } = req.params;

        const details = await pool.query('SELECT * FROM PRODUCTO, TALLA WHERE TALLA.TALLA_ID = PRODUCTO.TALLA_ID AND PRODUCTO.PRODUCTO_ID= ?', [producto_id]);

        const gallery = await pool.query('SELECT * FROM GALERIA WHERE GALERIA_ESTADO = "ACTIVO" AND GALERIA.PRODUCTO_ID = ?', [producto_id]);

        const comments = await pool.query('SELECT * FROM PRODUCTO, PERSONA, COMENTARIO WHERE PRODUCTO.PRODUCTO_ID = COMENTARIO.PRODUCTO_ID AND PERSONA.PERSONA_ID = COMENTARIO.PERSONA_ID AND PRODUCTO.PRODUCTO_ID = ? ORDER BY PRODUCTO.PRODUCTO_ID DESC LIMIT 5', [producto_id]);

        const commentCount = comments.length;

        const feachaAlta = details[0].PRODUCTO_FECHAALTA.toLocaleDateString('sv-SE');

        const recommended = await pool.query('SELECT * FROM PRODUCTO ORDER BY PRODUCTO.PRODUCTO_ID DESC LIMIT 4');

        res.render('store/detail', { detail: details[0], feachaAlta, comments, commentCount, gallery, recommended, count });

    },

    addToCart: async (req, res) => {
        const { PRODUCTO_ID } = req.body;
        const add = await pool.query('SELECT * FROM PRODUCTO, TALLA WHERE TALLA.TALLA_ID = PRODUCTO.PRODUCTO_ID AND PRODUCTO.PRODUCTO_ID = ?', [PRODUCTO_ID]);
        const addedProduct = add[0];

        const addId = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO.PRODUCTO_ID = ?', [PRODUCTO_ID]);
        const productsId = addId[0];

        try {
            if (req.user.PERSONA_ID) {
                const idUser = req.user.PERSONA_ID;
                Cart.save(productsId, addedProduct, idUser);
                res.redirect('/cart');
            }
        } catch {
            req.flash('messageCart', 'Debes iniciar sesion para comprar');
            res.redirect('/cart');
        }
    },

    getCart: async (req, res) => {
        const idUser = req.user.PERSONA_ID;

        const products = Cart.getCart(idUser);
        console.log(products.length);

        var total = products.reduce((sum, value) => (typeof value.PRODUCTO_PRECIO == "number" ? sum + value.PRODUCTO_PRECIO : sum), 0);// Sumar total productos

        var totalPrice = total.toFixed(0);

        res.render('store/cart', { products, totalPrice });
    },

    deleteInCart: async (req, res) => {
        const idUser = req.user.PERSONA_ID;
        const { PRODUCTO_ID } = req.body;
        Cart.delete(idUser, PRODUCTO_ID);
        res.redirect('/cart');
    },

    maxInCart: async (req, res) => {
        const idUser = req.user.PERSONA_ID;
        const { PRODUCTO_ID } = req.body;
        Cart.maxCart(idUser, PRODUCTO_ID);
        res.redirect('/cart');
    },

    minInCart: async (req, res) => {
        const idUser = req.user.PERSONA_ID;
        const { PRODUCTO_ID } = req.body;
        Cart.minCart(idUser, PRODUCTO_ID);
        res.redirect('/cart');
    },

    deleteCart: async (req, res) => {
        const idUser = req.user.PERSONA_ID;
        Cart.deleteCart(idUser);
        req.flash('message', 'Carrito vaciado correctamente');
        res.redirect('/shop');
    },

    checkout: async (req, res) => {

        const userId = req.user.PERSONA_ID;
        let boolBuy = [];

        var today = new Date();
        const sellDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

        const products = Cart.getCart(userId);
        var total = products.reduce((sum, value) => (typeof value.PRODUCTO_PRECIO == "number" ? sum + value.PRODUCTO_PRECIO : sum), 0);
        var totalPrice = total.toFixed(2);

        const { VENTA_ESTADO } = req.body;

        for (const i in products) { //Recorrer indices de productos comprados
            console.log(products[i]);
        }

        for (let i of products) {
            const addId = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO.PRODUCTO_ID = ?', [i.PRODUCTO_ID]);
            const productsId = addId[0];

            if (i.PRODUCTO_CANTIDAD <= productsId.PRODUCTO_STOCK) {
                boolBuy.push({ idUser: userId, ESTADO: true });
            } else {
                boolBuy.push({ idUser: userId, ESTADO: false });
            }
        }

        const isExisting = boolBuy.find(element => element.idUser == userId && element.ESTADO == false);

        if (isExisting) {
            req.flash('message', 'No se pudo realizar su compra, porque uno de los productos que deseaba comprar ya no se encuenta en stock o no posee la cantidad que usted desea comprar, por favor eliminelo de su lista de compra o modifique su cantidad');
            res.redirect('/cart/errorbuy');
        } else {
            const newSell = {
                PERSONA_ID: req.user.PERSONA_ID,
                VENTA_TOTAL: totalPrice,
                VENTA_FECHA: sellDate,
                VENTA_ESTADO
            }

            newSell.VENTA_ESTADO = 'ACTIVO';

            console.log(newSell);

            await pool.query('INSERT INTO VENTA set ?', [newSell]);

            const row = await pool.query('SELECT MAX(VENTA_ID) AS ID FROM VENTA, PERSONA WHERE VENTA.PERSONA_ID = PERSONA.PERSONA_ID AND PERSONA.PERSONA_ID = ?', [req.user.PERSONA_ID]);
            const lastId = row[0];
            const lastSell = lastId.ID;
            const saleProduct = '0';

            for (let i of products) {
                const detailSell = {
                    VENTA_ID: lastSell,
                    PRODUCTO_ID: i.PRODUCTO_ID,
                    DETALLEVENTA_CANTIDAD: i.PRODUCTO_CANTIDAD,
                    DETALLEVENTA_PRECIOUNITARIO: i.PRECIO_UNITARIO,
                    DETALLEVENTA_DESCUENTO: saleProduct,
                    DETALLEVENTA_TOTAL: i.PRODUCTO_PRECIO,
                }

                console.log(detailSell);

                await pool.query('INSERT INTO DETALLE_VENTA SET ?', [detailSell]);
            }

            // Aplicar un update al producto comprado, restando su stock
            for (let i of products) {
                const addId = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO.PRODUCTO_ID = ?', [i.PRODUCTO_ID]);
                const productsId = addId[0];

                const stock = productsId.PRODUCTO_STOCK - i.PRODUCTO_CANTIDAD

                await pool.query('UPDATE PRODUCTO SET PRODUCTO_STOCK = ? WHERE PRODUCTO.PRODUCTO_ID = ?', [stock, i.PRODUCTO_ID]);
            }

            //
            //
            console.log(req.body);
            const { stripeEmail, stripeToken } = req.body
            //Almacenamos el comprador
            const customer = await stripe.customers.create({
                email: stripeEmail,
                source: stripeToken
            })
            //Almacenar orden de compra
            const charge = await stripe.charges.create({
                amount: total,
                currency: 'usd',
                customer: customer.id,
                description: 'compra de prueba'
            })
            console.log(charge.id);
            //
            //

            Cart.deleteCart(userId);

            // req.flash('success', 'Compra exitosa, por favor revise su factura');
            res.redirect('/profile');
        }

    },

    errorCart: async (req, res) => {
        const userId = req.user.PERSONA_ID;
        let stockProduct = [];

        const products = Cart.getCart(userId);

        for (let i of products) {

            const addId = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO.PRODUCTO_ID = ?', [i.PRODUCTO_ID]);
            const productsId = addId[0];

            if (i.PRODUCTO_CANTIDAD <= productsId.PRODUCTO_STOCK) {
                // boolBuy.push({ idUser: userId, ESTADO: true });
            } else {
                stockProduct.push({
                    idUser: userId,
                    PRODUCTO_NOMBRE: productsId.PRODUCTO_NOMBRE,
                    PRODUCTO_CANTIDAD: productsId.PRODUCTO_CANTIDAD,
                    CANTIDAD_ACTUAL: i.PRODUCTO_CANTIDAD
                });
            }
        }

        var productStock = stockProduct.filter(function (userProduct) { return userProduct.idUser == userId; });

        res.render('store/errorbuy', { productStock });
    }

};