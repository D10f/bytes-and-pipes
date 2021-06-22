const request = require('supertest');
const app = require('../app');

test('Should signup a new user', async () => {
  await request(app)
    .post('/signup')
    .send({
      username: 'Oscar Mayer',
      email: 'oscar@example.com',
      password: 'oscarmayer!'
    })
    .expect(201) // status code
}, 20000) // optional time in ms before timeout error (default 5000)
