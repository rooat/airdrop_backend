import { Service } from 'egg';

/**
 * Country Service
 */
export default class Country extends Service {


  public async find() {
    const { ctx } = this;
    //return this.ctx.model.post.findAndCountAll();
    return ctx.model.Country.showList();
  }
}

