import { Controller } from 'egg';
import { ValRule, Status,ethUtil,StatusCode } from '../utils'

export default class CountryController extends Controller {
  /**
   * 电报群功能
   */
  public async res() {
    const { ctx } = this;
    console.log("ctx===========",ctx.req.connection.remoteAddress);
    console.log("ctx req header===========",ctx.request.header);
    console.log("ctx req header===========",ctx.request.header['X-Real-IP']);


    ctx.request.body.ip=ctx.request.header['X-Real-IP'];

    let addressk = ctx.request.body.address;
    ctx.request.body.address = addressk.toLowerCase();

    console.log(ctx.request.body);
    console.log(ethUtil.isValidAddress(ctx.request.body.address));
    if(!ethUtil.isValidAddress(ctx.request.body.address)){
      ctx.body = {
        ...Status(404,StatusCode.ADDRESS_IS_INVALID)
      }
      return;
    }
    try {
      ctx.validate(ValRule.BIND_ADDRESS_RULE);
    } catch (err) {
      ctx.logger.warn(err.errors);
      ctx.body = {
        ...Status(404, err.errors)
      }
      return;
    }
    return ctx.model.transaction(async t => {
      ctx.body = await ctx.service.telegram.bindWallet(t);
    });
  }

  /**
   * 查询已邀请人数接口
   */
  public async show(){
    const { ctx } = this;
    try {
      ctx.validate(ValRule.GET_INVITE_RULE);
    } catch (err) {
      ctx.logger.warn(err.errors);
      ctx.body = {
        ...Status(404, err.errors)
      }
      return;
    }
    return ctx.model.transaction(async t => {
      ctx.body = await ctx.service.telegram.showinvite(t);
    });
  }
}
