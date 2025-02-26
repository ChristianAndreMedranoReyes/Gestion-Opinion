import { Schema, model } from "mongoose";

const comentarioSchema = Schema({
    comentario: {
        type: String,
        required: [true, "Comment is required"],
        maxLenght: [200, "Max is 200 characters"]
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    publicacion: {
        type: Schema.Types.ObjectId,
        ref: 'Publicacion',
        required: true
    },
    parentComentario: {
        type: Schema.Types.ObjectId,
        ref: 'Comentario',
        default: null
    },
    status: {
        type: Boolean,
        default: true,
    },
},
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Comentario', comentarioSchema);