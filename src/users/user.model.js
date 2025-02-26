import { Schema, model } from "mongoose";

const UserSchema = Schema({
    name: { 
        type: String,
        required: [true, "Name is required"],
        maxLenght: [100, "Max is 100 characters"],
    },
    username: {
        type: String, 
        required: [true, "Username is required"],
        maxLenght: [50, "Max is 50 characters"],
    },
    email: { 
        type: String, 
        required: [true, "Email is required"],
        maxLenght: [100, "Max is 100 characters"],
        unique: true 
    },
    password: { 
        type: String, 
        required: [true, "Password is required"],
        minLenght: [5, "Min is 5 characters"],
    },
    role: {
        type: String,
        required: true,
        enum: ["ADMIN_ROLE", "USER_ROLE"],
    },
    status: {
        type: Boolean,
        default: true,
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('User', UserSchema);