import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { createComentario, getComentarios, updateComentario, deleteComentario } from "./comentario.controller.js";

const router = Router();

router.post(
    "/",
    validarJWT,
    createComentario
);

router.get(
    "/",
    getComentarios
);

router.put(
    "/:id",
    validarJWT,
    updateComentario
);

router.delete( 
    "/:id",
    validarJWT,
    deleteComentario
);

export default router;