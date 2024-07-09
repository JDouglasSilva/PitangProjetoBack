import { Router } from 'express';
import agendamentoController from '../controllers/agendamentoController';

const router = Router();

router.post('/', agendamentoController.create);
router.get('/', agendamentoController.getAll);
router.get('/monthly-count/:year', agendamentoController.getMonthlyCount);
router.get('/daily-count/:year/:month', agendamentoController.getDailyCount);
router.get('/:year/:month/:day', agendamentoController.getByDay);
router.patch('/:id', agendamentoController.updateStatus);

export default router;
