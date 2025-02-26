import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js"; 
import { validarRoles } from "../middlewares/validar-roles.js";
import { createCategory, getCategories, updateCategory, deleteCategory } from "../categorias/categoria.controller.js";

const router = Router();

router.get(
    "/", 
    getCategories
);

router.post(
    "/", 
    [
        validarJWT, 
        validarRoles
    ], 
    createCategory
);

router.put(
    "/:id", 
    [
        validarJWT, 
        validarRoles
    ], 
    updateCategory
);

router.delete(
    "/:id", 
    [
        validarJWT, 
        validarRoles
    ], 
    deleteCategory
);

export default router;