import User from '../users/user.model.js';
import { hash, verify } from 'argon2';
import { generarJWT } from '../helpers/generate-jwt.js';

export const register = async (req, res) =>{
    console.log("Datos recibidos:", req.body);
    try {
        const data = req.body;

        if(data.role === 'ADMIN_ROLE'){
            const existingAdmin = await User.findOne({role: 'ADMIN_ROLE'});

            if(existingAdmin){
                data.role = 'USER_ROLE';
            }
        }

        const encryptedPassword = await hash(data.password, 10);
        
        const user = await User.create({
            name: data.name,
            username: data.username,
            email: data.email,
            password: encryptedPassword,
            role: data.role
        });

        return res.status(200).json({
            msg: 'User created successfully',
            userDetails: {
                user: user.email,
                role: user.role
            }
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error, user could not be created',
            error: error.message
        });
        
    }
};

export const login = async (req, res) => {
    console.log("Datos recibidos en login:", req.body);
    const { email, password } = req.body;

    try {
        const lowerEmail = email ? email.toLowerCase() : null;

        console.log("Buscando usuario con:", { email: lowerEmail });
        const user = await User.findOne({ email: lowerEmail });

        if (!user) {
            return res.status(400).json({
                msg: 'Credenciales incorrectas, Correo no existe en la base de datos'
            });
        }

        if (!user.status) {
            return res.status(400).json({
                msg: 'Usuario no existe en la base de datos'
            });
        }

        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Credenciales incorrectas, contraseña incorrecta'
            });
        }

        const token = await generarJWT(user.id);

        return res.status(200).json({
            msg: 'Login successful',
            userDetails: {
                username: user.username,
                token: token,
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Server error',
            error: error.message
        });
    }
};


