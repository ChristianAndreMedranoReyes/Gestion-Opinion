import { Router } from 'express';
import { getUser, updateUser, updatePassword } from '../users/user.controller.js';

const router = Router();

router.get('/:', getUser);
router.put('/:id', updateUser);
router.put('/password/:id', updatePassword);

export default router;