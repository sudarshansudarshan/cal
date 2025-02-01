import { Router } from 'express';
import * as UserSessionHandling from '../controllers//UserSessionHandling';

const router = Router();

router.post('/auth', UserSessionHandling.createSession);
router.delete('/auth/:user_id', UserSessionHandling.deleteUser);
router.put('/auth/:user_id', UserSessionHandling.updateUser);

export default router;  