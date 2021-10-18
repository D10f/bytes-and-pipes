import { RequestHandler } from 'express';

export const loginUser: RequestHandler = (req) => {
  const { username, password } : { username: string, password: string } = req.body;
  return { username, password };
};

export const test = {
  name: 'hello'
};

let num = 2;

console.log(num);
