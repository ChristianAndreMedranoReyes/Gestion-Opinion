import { response } from 'express';
import Publicacion from './publicacion.model.js';
import Categoria from '../categorias/categoria.model.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const createPublicacion = async (req, res = response) => {
    try {
        const token = req.header("x-token");
        if (!token) {
            return res.status(400).json({
                succes: false,
                msg: "Token is required",
            });
        }

        const { uid } = jwt.verify(token, process.env.SECRET_KEY);
        const { titulo, contenido, categoria } = req.body;

        // Debugging logs
        console.log("Body recibido:", req.body);
        console.log("Categoria ID recibido:", categoria);

        if (!mongoose.Types.ObjectId.isValid(categoria)) {
            return res.status(400).json({
                succes: false,
                msg: "Invalid category ID format",
            });
        }

        const categoryFound = await Categoria.findById(categoria);
        console.log("Categoría encontrada:", categoryFound);

        if (!categoryFound) {
            return res.status(400).json({
                succes: false,
                msg: "Category not found",
            });
        }

        const newPublicacion = new Publicacion({
            titulo,
            contenido,
            categoria: categoryFound._id,
            author: uid,
        });

        await newPublicacion.save();
        res.status(201).json({
            succes: true,
            msg: "Publicacion creada correctamente",
            newPublicacion,
        });
    } catch (error) {
        console.error("Error al crear la publicación:", error);
        return res.status(500).json({
            succes: false,
            msg: "Error, publicacion could not be created",
            error: error.message,
        });
    }
};


export const getPublicaciones = async (req, res = response) => {
    try {
        const publicaciones = await Publicacion.find({ status: true })
            .populate("author", "name")
            .populate("categoria", "name");

        res.status(200).json({
            success: true,
            publicaciones,
        });
    } catch (error) {
        console.error("Error en getPublicaciones:", error);
        res.status(500).json({ success: false, msg: "Error al obtener publicaciones" });
    }
}

export const updatePublicacion = async (req, res = response) => {
    try {
        const token = req.header("x-token");
        if (!token) {
            return res.status(400).json({ msg: "No hay token en la petición" });
        }

        const { uid } = jwt.verify(token, process.env.SECRET_KEY);
        const { id } = req.params;
        const { titulo, contenido, categoria } = req.body;

        const publicacion = await Publicacion.findById(id);
        if (!publicacion) {
            return res.status(404).json({
                succes: false,
                msg: "Publicacion not found",
            });
        }

        if (publicacion.author.toString() !== uid) {
            return res.status(401).json({
                succes: false,
                msg: "Unauthorized",
            });
        }

        let categoryFound = await Categoria.findById(categoria);
        if (!categoryFound) {
            return res.status(400).json({
                succes: false,
                msg: "Category not found",
            });
        }

        const updatedPublicacion = await Publicacion.findByIdAndUpdate(
            id,
            { titulo, contenido, categoria: categoryFound._id },
            { new: true }
        ).populate("author", "name")
        .populate("categoria", "name");

        res.status(200).json({
            succes: true,
            msg: "Publicacion updated successfully",
            publicacion: {
                _id: updatedPost._id,
                title: updatedPost.title,
                category: updatedPost.category.name,
                content: updatedPost.content,
                author: updatedPost.author.name,
                createdAt: updatedPost.createdAt,
                updatedAt: updatedPost.updatedAt
            }
        });
    } catch (error) {
        console.error("Error al actualizar la publicación:", error);
        return res.status(500).json({
            success: false,
            msg: "Error, publicacion could not be updated",
            error: error.message,
        });
    }
};

export const deletePublicacion = async (req, res = response) => {
    try {
        const token = req.header("x-token");
        if (!token) {
            return res.status(400).json({ msg: "No hay token en la petición" });
        }

        const { uid } = jwt.verify(token, process.env.SECRET_KEY);
        const { id } = req.params;

        const publicacion = await Publicacion.findById(id);
        if (!publicacion) {
            return res.status(404).json({
                succes: false,
                msg: "Publicacion not found",
            });
        }

        if (publicacion.author.toString() !== uid) {
            return res.status(401).json({
                succes: false,
                msg: "Unauthorized",
            });
        }

        if (publicacion.status === false) {
            return res.status(400).json({
                succes: false,
                msg: "Publicacion already deleted",
            });
        }

        res.status(200).json({
            succes: true,
            msg: "Publicacion deleted successfully",
            publicacion,
        });

    } catch (error) {
        console.error("Error al eliminar la publicación:", error);
        return res.status(500).json({
            succes: false,
            msg: "Error, publicacion could not be deleted",
            error: error.message,
        });
    }
}