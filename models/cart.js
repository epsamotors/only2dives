let cart = [];

module.exports = class Cart {

    static save(idProduct, product, idUser) {

        const userBuy = idUser,

            productId = idProduct.PRODUCTO_ID,

            productNombre = product.PRODUCTO_NOMBRE,
            productPrecio = product.PRODUCTO_PRECIO,
            productImagen = product.PRODUCTO_URL,
            productTalla = product.TALLA_NOMBRE,
            productCantidad = product.PRODUCTO_STOCK;

        const existingProductIndex = cart.find(element => element.idUser == userBuy && element.PRODUCTO_ID == productId);

        if (existingProductIndex) {
            console.log('Producto ya existente');
        } else {
            cart.push({
                idUser: userBuy,
                PRODUCTO_ID: productId,
                PRODUCTO_NOMBRE: productNombre,
                TALLA_NOMBRE: productTalla,
                PRODUCTO_URL: productImagen,

                PRODUCTO_CANTIDAD: 1, //Base de compra, va a hacer siempre 1
                CANTIDAD_TOTAL: productCantidad, //Stock de producto ofertado
                PRECIO_UNITARIO: productPrecio, //Precio del producto
                PRODUCTO_PRECIO: productPrecio, //Precio total, cantidad * precio unitario
            });
        }
    }

    static minCart(userId, productId) {
        const isExisting = cart.findIndex(element => element.idUser == userId && element.PRODUCTO_ID == productId);
        if (isExisting >= 0) {
            const exsitingProduct = cart[isExisting];
            if (exsitingProduct.PRODUCTO_CANTIDAD > 1) {
                exsitingProduct.PRODUCTO_CANTIDAD -= 1;
                exsitingProduct.PRODUCTO_PRECIO = exsitingProduct.PRECIO_UNITARIO * exsitingProduct.PRODUCTO_CANTIDAD;
            }
        }
    }

    static maxCart(userId, productId) {
        const isExisting = cart.findIndex(element => element.idUser == userId && element.PRODUCTO_ID == productId);
        if (isExisting >= 0) {
            const exsitingProduct = cart[isExisting];
            if (exsitingProduct.PRODUCTO_CANTIDAD < exsitingProduct.CANTIDAD_TOTAL) {
                exsitingProduct.PRODUCTO_CANTIDAD += 1;
                exsitingProduct.PRODUCTO_PRECIO = exsitingProduct.PRECIO_UNITARIO * exsitingProduct.PRODUCTO_CANTIDAD;
            }
        }
    }

    static getCart(userId) {
        var products = cart.filter(function (userProduct) { return userProduct.idUser == userId; });
        return products;
    }

    static delete(userId, productId) {
        const isExisting = cart.findIndex(element => element.idUser == userId && element.PRODUCTO_ID == productId);
        if (isExisting >= 0) {
            cart.splice(isExisting, 1);
        }
    }

    static deleteCart(userId) {
        while (cart.findIndex(e => e.idUser == userId) >= 0)
            cart.splice(cart.findIndex(f => f.idUser == userId), 1);
    }
}