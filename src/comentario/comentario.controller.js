import { response } from "express";
import Comentario from "./comentario.model.js";
import Publicacion from "../publicacion/publicacion.model.js";
import jwt from "jsonwebtoken";
import { populate } from "dotenv";

import mongoose from 'mongoose';
import Comentario from './comentario.model.js';
import Publicacion from '../publicacion/publicacion.model.js';

export const createComentario = async (req, res) => {
    try {
        const { comentario, usuario, publicacion } = req.body;

        // Validar que todos los campos requeridos están presentes
        if (!comentario || !usuario || !publicacion) {
            return res.status(400).json({
                success: false,
                msg: "All fields (comentario, usuario, publicacion) are required",
            });
        }

        // Verificar si los IDs son válidos
        if (!mongoose.Types.ObjectId.isValid(usuario) || !mongoose.Types.ObjectId.isValid(publicacion)) {
            return res.status(400).json({
                success: false,
                msg: "Invalid ObjectId format for usuario or publicacion",
            });
        }

        // Verificar que la publicación existe
        const publicacionExistente = await Publicacion.findById(publicacion);
        if (!publicacionExistente) {
            return res.status(404).json({
                success: false,
                msg: "Publicacion not found",
            });
        }

        const nuevoComentario = new Comentario({
            comentario,
            usuario,
            publicacion
        });

        await nuevoComentario.save();
        res.status(201).json({
            success: true,
            msg: "Comentario creado correctamente",
            comentario: nuevoComentario,
        });
    } catch (error) {
        console.error("Error al crear el comentario:", error);
        res.status(500).json({
            success: false,
            msg: "Error, comentario could not be created",
            error: error.message,
        });
    }
};


export const getComentarios = async (req, res = response) => {
    try {
        const comentarios = await Comentario.find({ status: true })
            .populate("author", "name")
            .populate("publicacion", "titulo")
            .populate({
                select: "contenido createdAt",
                populate: { path: "author", select: "name" },
            });

            const comentarioMapa = {};
            comentarios.forEach(comentario => {
                comentarioMapa[comentario._id] = {
                    _id: comentario._id,
                    post: comentario.post.status ? comentario.post.title : "Post eliminado",
                    content: comentario.status ? comentario.content : "Comentario Eliminado",
                    author: comentario.author.name,
                    parentComentario: comentario.parentComentario
                        ? {
                            content: comentario.parentComentario.status 
                                ? comentario.parentComentario.content 
                                : "Comentario Eliminado",
                            author: comentario.parentComentario.author.name
                        }
                        : null,
                    replies: []
            };
        });

const comentariosAnidados = [];
comentarios.forEach(comentario => {
    if (comentario.parentComentario) {
        comentarioMapa[comentario.parentComentario._id].replies.push(comentarioMapa[comentario._id]);
    } else {
        comentariosAnidados.push(comentarioMapa[comentario._id]);
    }
});

res.status(200).json({
    success: true,
    total: comentariosAnidados.length,
    comentarios: comentariosAnidados
});
            
    } catch (error) {
        console.error("Error en getComentarios:", error);
        res.status(500).json({ 
            success: false, 
            msg: "Error al obtener comentarios" });
    }
};

export const updateComentario = async (req, res = response) => {
    try {
        const token = req.header("x-token");
        if (!token) {
            return res.status(400).json({
                succes: false,
                msg: "Token is required",
            });
        }

        const { uid } = jwt.verify(token, process.env.SECRET_KEY);
        const { id } = req.params;
        const { contenido } = req.body;

        const comentario = await Comentario.findById(id);
        if (!comentario) {
            return res.status(404).json({
                succes: false,
                msg: "Comentario not found",
            });
        }

        if (comentario.author.toString() !== uid) {
            return res.status(403).json({
                succes: false,
                msg: "Unauthorized",
            });
        }

        if (comentario.status === false) {
            return res.status(400).json({
                succes: false,
                msg: "Comentario already deleted",
            });
        }
        
        comentario.contenido = contenido;
        comentario.updatedAt = Date.now();
        await comentario.save();

        res.status(200).json({
            succes: true,
            msg: "Comentario updated successfully",
            comentario,
        })
    } catch (error) {
        return res.status(500).json({
            succes: false,
            msg: "Error, comentario could not be updated",
            error: error.message,
        });
        
    }
};

export const deleteComentario = async (req, res = response) => {
    try {
        const token = req.header("x-token");
        if (!token) {
            return res.status(400).json({
                succes: false,
                msg: "Token is required",
            });
        }

        const { uid } = jwt.verify(token, process.env.SECRET_KEY);
        const { id } = req.params;

        const comentario = await Comentario.findById(id);
        if (!comentario) {
            return res.status(404).json({
                succes: false,
                msg: "Comentario not found",
            });
        }

        if (comentario.author.toString() !== uid) {
            return res.status(403).json({
                succes: false,
                msg: "Unauthorized",
            });
        }

        if (comentario.status === false) {
            return res.status(400).json({
                succes: false,
                msg: "Comentario already deleted",
            });
        }

        await Comentario
            .findByIdAndUpdate(id, { status: false }, { new: true });
        
        res.status(200).json({
            succes: true,
            msg: "Comentario deleted successfully",
        });
    } catch (error) {
        console.error("Error al eliminar el comentario:", error);
        return res.status(500).json({
            succes: false,
            msg: "Error, comentario could not be deleted",
            error: error.message,
        });
    }
}