const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/user');
const { sendConfirmationEmail } = require('../emails/account');

const router = express.Router();

router.get('/users/me', auth, async (req, res) => {
  res.send({
    user: req.user,
    token: req.user.token
  });
});

router.post('/signup', async (req, res) => {
  try {
    const user = await new User(req.body);
    await user.save();
    // sendConfirmationEmail(user);
    res.status(201).send();
  } catch(err) {
    res.status(400).send(err);
  }
});

router.get('/confirm/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      active: false,
      activationToken: req.params.token
    });

    if (!user) {
      throw new Error('Confirmation code is invalid or has expired');
    }

    user.activateUser();
    const token = await user.generateAuthToken();
    await user.save();
    res.send({ user, token });

  } catch (e) {
    res.status(400).send(e.message)
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);

    const token = await user.generateAuthToken();

    await user.save();
    res.send({ user, token });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post('/logout', auth, async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    })
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

router.patch('/users/update', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['email', 'password']
  const isValid = updates.every(update => allowedUpdates.includes(update))

  if(!isValid){
    return res.status(400).send({ error: 'Invalid updated fields' })
  }

  try {
    updates.forEach(update => req.user[update] = req.body[update])
    await req.user.save()
    res.send(user)
  } catch(err) {
    res.status(400).send(err)
  }
})

// If user deletes account all files uploaded by user are removed as well
router.delete('/users/delete', auth, async (req, res) => {
  try {
    await req.user.remove()
    res.send()
  } catch (err){
    res.status(500).send()
  }
})

module.exports = router
