import { Schema,model } from "mongoose";
import { preventDefaultCategoriaDeletion } from "../middlewares/category-default.js";

const CategoriaSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

CategoriaSchema.pre('findOneAndDelete', preventDefaultCategoriaDeletion);

export default model('Categoria', CategoriaSchema);