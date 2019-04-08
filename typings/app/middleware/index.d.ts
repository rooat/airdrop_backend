// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Request from '../../../app/middleware/request';

declare module 'egg' {
  interface IMiddleware {
    request: ReturnType<typeof Request>;
  }
}
