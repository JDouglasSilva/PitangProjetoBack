import request from 'supertest';
import app from '../src/app';

describe('Server', () => {
  let server: any;

  beforeAll((done) => {
    server = app.listen(4000, () => {
      console.log('Test server running on port 4000');
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should start the server and respond to a health check', async () => {
    const response = await request(server).get('/agendamentos');
    expect(response.status).toBe(200);
  });

  it('should start the server on the specified port', () => {
    const port = server.address().port;
    expect(port).toBe(4000);
  });
});
