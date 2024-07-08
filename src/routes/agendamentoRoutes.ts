import { Router } from 'express';
import agendamentoController from '../controllers/agendamentoController';

const router = Router();

router.post('/', agendamentoController.create);
router.get('/', agendamentoController.getAll);

export default router;
