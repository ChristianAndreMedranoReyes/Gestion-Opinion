import  { body } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { existenteEmail, esRoleValido } from "../helpers/db-validator.js";

export const registerValidator = [
    body("name", "The name is required").not().isEmpty(),
    body("username", "The username is required").not().isEmpty(),
    body("email", "You must enter a valid email").isEmail(),
    body("email").custom(existenteEmail),
    body("password", "Password must be at least 6 chatacters").isLength({ min: 6 }),
    validarCampos
];

export const loginValidator = [
    body("name").optional().isString().withMessage("Ingresa un name valido"),
    body("email").optional().isEmail().withMessage("Ingresa una dirección de correo valida"),
    body("password", "La contraseña debe tener minimo 6 caracteres").isLength({min: 6}),
    validarCampos
]