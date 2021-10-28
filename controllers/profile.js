const pool = require('../database');
var PDFDocument = require('pdfkit');

module.exports = {

    getDateProducts: async (req, res) => {
        const { PERSONA_ID } = req.user;
        var formatDate = [];

        // const products = await pool.query('SELECT * FROM DETALLE_VENTA, PRODUCTO, PERSONA, VENTA, TALLA WHERE DETALLE_VENTA.VENTA_ID = VENTA.VENTA_ID AND PERSONA.PERSONA_ID = VENTA.PERSONA_ID AND PRODUCTO.PRODUCTO_ID = DETALLE_VENTA.PRODUCTO_ID AND PRODUCTO.TALLA_ID = TALLA.TALLA_ID AND PERSONA.PERSONA_ID = ? ORDER BY DETALLE_VENTA.DETALLEVENTA_ID DESC', [PERSONA_ID]);

        const dateProducts = await pool.query('SELECT * FROM VENTA where PERSONA_ID= ? GROUP BY VENTA_FECHA ORDER BY VENTA_FECHA', [PERSONA_ID]);

        for (const i in dateProducts) {
            console.log(dateProducts[i]);
            formatDate.push({
                VENTA_FECHA: dateProducts[i].VENTA_FECHA.toLocaleDateString('sv-SE'),
            });
        }

        // for (const i in formatDate) {
        //     console.log(formatDate[i]);
        // }

        res.render('profile/list', { formatDate });
    },

    getAllDateBuy: async (req, res) => {
        const { PERSONA_ID } = req.user;
        const { VENTA_FECHA } = req.body;
        let total = 0;

        console.log('PERSONA_ID: ' + PERSONA_ID + ' VENTA_FECHA: ' + VENTA_FECHA);

        const row = await pool.query('SELECT * FROM PERSONA WHERE PERSONA_ID = ?', [PERSONA_ID])
        const profile = row[0];

        // const detailBuy = await pool.query('SELECT * FROM DETALLE_VENTA, VENTA, PERSONA WHERE PERSONA.PERSONA_ID = VENTA.PERSONA_ID AND VENTA.VENTA_ID = DETALLE_VENTA.VENTA_ID AND PERSONA.PERSONA_ID = ? AND VENTA.VENTA_FECHA = ?', [PERSONA_ID, VENTA_FECHA])
        const detailBuy = await pool.query('SELECT * FROM DETALLE_VENTA, VENTA, PERSONA, PRODUCTO WHERE PERSONA.PERSONA_ID = VENTA.PERSONA_ID AND VENTA.VENTA_ID = DETALLE_VENTA.VENTA_ID AND PRODUCTO.PRODUCTO_ID = DETALLE_VENTA.PRODUCTO_ID AND PERSONA.PERSONA_ID = ? AND VENTA.VENTA_FECHA = ?', [PERSONA_ID, VENTA_FECHA]);

        for (const i in detailBuy) {
            total += detailBuy[i].DETALLEVENTA_TOTAL
        }

        console.log('total:' + total);

        const doc = new PDFDocument();

        var filename = encodeURIComponent(Math.random()) + '.pdf';
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');

        //Header
        doc
            .fillColor("#444444")
            .fontSize(20)
            .text("only2ndvibes", 50, 57)
            .fontSize(10)
            .font("Helvetica-Bold")
            .text("Fecha de compra:", 400, 65)
            .font("Helvetica")
            .text(VENTA_FECHA, 200, 65, { align: "right" })
            .text("Colombia", 200, 80, { align: "right" })
            .moveDown();

        //body
        doc
            .fillColor("#444444")
            .fontSize(15)
            .text("Datos Personales", 50, 160);

        doc.strokeColor("#aaaaaa")
            .lineWidth(1)
            .moveTo(50, 190)
            .lineTo(550, 190)
            .stroke();

        const customerInformationTop = 200;

        doc
            .fontSize(10)
            .font("Helvetica-Bold")
            .text("Nombre:", 50, customerInformationTop)
            .font("Helvetica")
            .text(profile.PERSONA_NOMBRE, 125, customerInformationTop)

            .fontSize(10)
            .font("Helvetica-Bold")
            .text("Telefono:", 50, customerInformationTop + 15)
            .font("Helvetica")
            .text(profile.PERSONA_TELEFONO, 125, customerInformationTop + 15)

            .fontSize(10)
            .font("Helvetica-Bold")
            .text("Dirección:", 50, customerInformationTop + 30)
            .font("Helvetica")
            .text(profile.PERSONA_CORREO, 125, customerInformationTop + 30)

            .moveDown();

        doc.strokeColor("#aaaaaa")
            .lineWidth(1)
            .moveTo(50, 250)
            .lineTo(550, 250)
            .stroke();


        doc
            .fillColor("#444444")
            .fontSize(15)
            .text("Orden de Compra", 50, 300);

        //Head Table
        let invoiceTableHead = 330;

        doc.strokeColor("#aaaaaa")
            .lineWidth(1)
            .moveTo(50, invoiceTableHead + 10)
            .lineTo(550, invoiceTableHead + 10)
            .stroke();

        doc

            .fontSize(10)
            .font("Helvetica-Bold")
            .text("Producto", 50, invoiceTableHead + 20)

            .fontSize(10)
            .font("Helvetica-Bold")
            .text("Cantidad", 200, invoiceTableHead + 20)

            .fontSize(10)
            .font("Helvetica-Bold")
            .text("Precio", 250, invoiceTableHead + 20)

            .fontSize(10)
            .font("Helvetica-Bold")
            .text("Total", 300, invoiceTableHead + 20)

            .moveDown();

        doc.strokeColor("#aaaaaa")
            .lineWidth(1)
            .moveTo(50, invoiceTableHead + 35)
            .lineTo(550, invoiceTableHead + 35)
            .stroke();

        //Table        
        let invoiceTableBody = 380;

        for (const i of detailBuy) {
            doc
                .fontSize(10)
                .font("Helvetica")
                .text(i.PRODUCTO_NOMBRE, 50, invoiceTableBody)

                .fontSize(10)
                .font("Helvetica")
                .text(i.DETALLEVENTA_CANTIDAD, 200, invoiceTableBody)

                .fontSize(10)
                .font("Helvetica")
                .text(i.DETALLEVENTA_PRECIOUNITARIO, 250, invoiceTableBody)

                .fontSize(10)
                .font("Helvetica")
                .text(i.DETALLEVENTA_TOTAL, 300, invoiceTableBody)

            doc.strokeColor("#aaaaaa")
                .lineWidth(1)
                .moveTo(50, invoiceTableBody + 15)
                .lineTo(550, invoiceTableBody + 15)
                .stroke();

            invoiceTableBody = invoiceTableBody + 25;
        }

        // Table foot
        doc
            .fontSize(10)
            .font("Helvetica-Bold")
            .text("Total: $", 230, invoiceTableBody)

            .fontSize(10)
            .font("Helvetica")
            .text(total, 300, invoiceTableBody)

        doc.pipe(res);
        doc.end();

        total = 0;
    },

    editPeoplePost: async (req, res) => {
        const { PERSONA_ID } = req.user;

        const rows = await pool.query('SELECT * FROM PERSONA WHERE PERSONA_ID = ?', [PERSONA_ID]);
        const profile = rows[0];

        const { ROL_ID, PERSONA_NOMBRE, PERSONA_CORREO, NUEVA_CONTRASENA, PERSONA_CONTRASENA, PERSONA_ESTADO } = req.body;

        const newUser = {
            ROL_ID,
            PERSONA_NOMBRE,
            PERSONA_CORREO,
            PERSONA_CONTRASENA,
            PERSONA_ESTADO,
        }

        console.log(newUser);

        newUser.PERSONA_NOMBRE = newUser.PERSONA_NOMBRE.toUpperCase();
        newUser.ROL_ID = profile.ROL_ID;
        newUser.PERSONA_CORREO = profile.PERSONA_CORREO;
        newUser.PERSONA_ESTADO = profile.PERSONA_ESTADO;

        if (NUEVA_CONTRASENA) {
            newUser.PERSONA_CONTRASENA = NUEVA_CONTRASENA;
        } else {
            newUser.PERSONA_CONTRASENA = profile.PERSONA_CONTRASENA;
        }

        console.log(newUser);
        await pool.query('UPDATE PERSONA set ? WHERE PERSONA_ID = ?', [newUser, PERSONA_ID]);
        // req.flash('success', 'Usuario Modificado');
        res.redirect('/profile');
    },

    commentProduct: async (req, res) => {

        var today = new Date();
        const productDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

        const { PRODUCTO_ID, COMENTARIO_DESCRIPCION, COMENTARIO_CALIFICACION, COMENTARIO_FECHA, COMENTARIO_ESTADO } = req.body;

        const newComment = {
            PRODUCTO_ID,
            PERSONA_ID: req.user.PERSONA_ID,
            COMENTARIO_DESCRIPCION,
            COMENTARIO_CALIFICACION,
            COMENTARIO_FECHA,
            COMENTARIO_ESTADO
        }

        newComment.COMENTARIO_DESCRIPCION = newComment.COMENTARIO_DESCRIPCION.toUpperCase();
        newComment.COMENTARIO_FECHA = productDate;
        newComment.COMENTARIO_ESTADO = 'ACTIVO';

        console.log(newComment);

        await pool.query('INSERT INTO COMENTARIO set ?', [newComment]);
        // req.flash('success', 'Imagen Comentada');
        // res.redirect('/profile');
        res.redirect(`/detail/${PRODUCTO_ID}`);
    }

}