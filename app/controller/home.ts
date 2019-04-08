import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    console.log(this);
    const { ctx } = this;
    ctx.body = await ctx.service.test.sayHi();
  }
}
