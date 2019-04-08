import { Controller } from 'egg';

export default class CountryController extends Controller {
  /**
   * 获取国家码接口
   */
  public async getCountry() {
    const { ctx } = this;
    ctx.body = await ctx.service.country.find();
  }
}
