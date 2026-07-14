import { CommonForm } from './common.js';
import { main } from './variants/main.js';
import { submitWithAServerFunction } from './variants/submit-with-a-server-function.js';
import { usingWithZod } from './variants/using-with-zod.js';

export const variants = {
  main,
  submitWithAServerFunction,
  usingWithZod,
};

export const Form = Object.assign(CommonForm, { variants });

export { CommonForm } from './common.js';
