import { Router } from 'express';
import agendamentoController from '../controllers/agendamentoController';

const router = Router();

router.post('/', agendamentoController.create);
router.get('/', agendamentoController.getAll);
router.get('/monthly-count/:year', agendamentoController.getMonthlyCount);

export default router;
