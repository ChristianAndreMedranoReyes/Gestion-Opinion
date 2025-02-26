import jwt from 'jsonwebtoken';
import User from '../users/user.model.js';

export const validarJWT = async (req, res, next) => {
    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({
            success: false,
            msg: "No hay token en la petición",
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(uid);

        if (!user) {
            return res.status(401).json({
                success: false,
                msg: "Usuario inexistente",
            });
        }

        if (!user.status) {
            return res.status(401).json({
                success: false,
                msg: "Usuario no válido",
            });
        }

        req.user = user; 
        next();

    } catch (error) {
        console.error("Error validarJWT:", error);
        return res.status(401).json({
            success: false,
            msg: "Token not valid",
        });
    }
};