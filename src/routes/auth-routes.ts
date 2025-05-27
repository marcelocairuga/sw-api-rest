import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller';

const router = Router();
const controller = new AuthController();

router.post('/register', async (req, res) => { await controller.register(req, res) });
router.post('/login', async (req, res) => { await controller.login(req, res) });

export default router;