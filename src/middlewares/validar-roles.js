export const validarRoles = (req, res, next) => {
    if (!req.user) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        });
    }

    if (req.user.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: 'El usuario no es administrador'
        });
    }

    next();
}