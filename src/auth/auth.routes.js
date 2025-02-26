import { Router } from "express";
import { registerValidator, loginValidator } from "../middlewares/validator.js";
import { login,register } from '../auth/auth.controller.js';


const router = Router();
 
router.post(
    '/login',
    loginValidator,
    login
);
 
router.post(
    '/register',
    registerValidator,
    register
)
 
export default router;