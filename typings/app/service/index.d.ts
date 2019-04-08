// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Country from '../../../app/service/Country';
import Telegram from '../../../app/service/Telegram';
import Test from '../../../app/service/Test';
import User from '../../../app/service/User';

declare module 'egg' {
  interface IService {
    country: Country;
    telegram: Telegram;
    test: Test;
    user: User;
  }
}
