const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
require('../db/mongoose');

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  username: 'Mike Myers',
  email: 'michaelmyers@example.com',
  password: 'mikewhat55!',
  tokens: [{
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
  }]
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/signup')
    .send({
      username: 'Oscar Mayer',
      email: 'oscar2@example.com',
      password: 'oscarmayer!'
    })
    .expect(201);

    // Assert that the database contains the new user
    const user = await User.findById(userOne._id);
    expect(user).not.toBeNull();

    // Assert that the response body contains the name of the user
    expect(response.body).toMatchObject({
      username: 'Oscar Mayer',
      email: 'oscar2@example.com',
      usedStorage: 0,
      maxStorage: 1073741824
    });

    // Assert that the password is being hashed
    expect(user.password).not.toBe('oscarmayer!');
});

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/login')
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);

    // Assert that an additional token is created when loggin in.
    const user = await User.findByCredentials(userOne.email, userOne.password);
    expect(user.tokens.length).toBe(2);
});

test('Should NOT login non-existing user', async () => {
  await request(app)
    .post('/login')
    .send({
      email: 'doesnotexist@example.com',
      password: 'completelyfictional'
    })
    .expect(400);
});

test('Should get user profile', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
});

test('Should NOT get user profile', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
});

test('Should delete user profile', async () => {
  await request(app)
    .delete('/users/delete')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

    const user = await User.findById(userOne._id);
    expect(user).toBeNull();
});

test('Should NOT delete user profile', async () => {
  await request(app)
    .delete('/users/delete')
    .send()
    .expect(401);

    const user = await User.findById(userOne._id);
    expect(user).not.toBeNull();
});
