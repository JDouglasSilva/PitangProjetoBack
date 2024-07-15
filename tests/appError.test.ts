import AppError from '../src/errors/AppError';

describe('AppError', () => {
  it('deve criar um erro com uma mensagem e código de status padrão', () => {
    const error = new AppError('Erro padrão');
    expect(error.message).toBe('Erro padrão');
    expect(error.statusCode).toBe(400);
  });

  it('deve criar um erro com uma mensagem e código de status específico', () => {
    const error = new AppError('Erro específico', 404);
    expect(error.message).toBe('Erro específico');
    expect(error.statusCode).toBe(404);
  });
});
