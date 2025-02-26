import { Schema, model } from "mongoose";

const publicacionSchema = new Schema({
    titulo: { 
        type: String, 
        required: true 
    },
    categoria: { 
        type: Schema.Types.ObjectId, 
        ref: "Category",
        required: true
    },
    contenido: { 
        type: String, 
        required: true 
    },
    author: { 
        type: Schema.Types.ObjectId, 
        ref: "User",  
        required: true 
    },
    status: { 
        type: Boolean, 
        default: true, 
    },
},
{
    timestamps: true, 
    versionKey: false 
});

export default model('Publicacion', publicacionSchema);