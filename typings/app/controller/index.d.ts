// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Country from '../../../app/controller/country';
import Home from '../../../app/controller/home';
import Telegram from '../../../app/controller/telegram';
import User from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    country: Country;
    home: Home;
    telegram: Telegram;
    user: User;
  }
}
