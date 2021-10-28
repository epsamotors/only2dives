module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {//Envia un true, si la secion del usuario existe, si no existe significa que el usuario no se a logueado
            return next();
        }
        return res.redirect('/');//Si no esta logueado redirecciona a la vista signin, para que se logue primero
    },

    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/shop');
    },

    isAdmin(req, res, next) {
        try {
            if (req.user.ROL_ID == '1') {
                return next();
            }
            return res.redirect('/shop');
        } catch {
            return res.redirect('/');
        }
    },

    isPartner(req, res, next) {
        try {
            if (req.user.ROL_ID == '2') {
                return next();
            }
            return res.redirect('/shop');
        } catch {
            return res.redirect('/');
        }
    }

};