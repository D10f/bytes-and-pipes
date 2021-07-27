const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const fileExists = promisify(fs.exists);

const request = require('supertest');
const fetch = require('unfetch');
const app = require('../app');
const File = require('../models/user');
require('../db/mongoose');

test('Should upload a file as a stream', async () => {
  const filename = 'postman.png';
  const filepath = path.resolve(__dirname, 'fixtures', filename);
  const file = await readFile(filepath);
  const filesize = file.length;
  const finalDir = path.resolve(__dirname, '..', 'uploads-test', filename);

  await fetch(`http://localhost:3000/upload/${filename}/1`, {
    method: 'POST',
    headers: {
      "Access-Control-Request-Headers": "Content-type,Content-parts,Content-filesize",
      "Content-type": "application/octet-stream",
      "Content-parts": 1,
      "Content-filesize": filesize,
    },
    body: file
  });

  // const res = await request(app)
  //   .post(`/upload/${filename}/1`)
  //   .set('Access-Control-Request-Headers', 'Content-type,Content-parts,Content-filesize')
  //   .set('Content-type', 'application/octet-stream')
  //   .set('Content-parts', 1)
  //   .set('Content-filesize', filesize)

    // .attach('', filepath, { contentType: 'application/octet-stream' })
    // .expect(201)

  // Assert that the file exists
  const itExists = await fileExists(finalDir);
  expect(itExists).toBe(true);

  // Assert that the file size is the same as the original
  // const newFilesize = await readFile(finalDir);
  // expect(newFilesize).toBe(filesize);
});

// Test that a file has 64 bytes per chunk extra
