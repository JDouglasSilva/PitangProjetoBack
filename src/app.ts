import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import agendamentoRoutes from './routes/agendamentoRoutes';
import errorMiddleware from './middlewares/errorMiddleware';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/agendamentos', agendamentoRoutes);

app.use(errorMiddleware);

export default app;
