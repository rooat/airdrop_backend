import { Controller } from 'egg';
import { ValRule, Status } from '../utils'

export default class UserController extends Controller {
  t: any;
  /**
   * 绑定手机接口
   */
  public async create() {
    const { ctx } = this;
    // 校验 `ctx.request.body` 是否符合我们预期的格式
    // 如果参数校验未通过，将会抛出一个 status = 422 的异常
    try {
      ctx.validate(ValRule.CREATE_RULE);
    } catch (err) {
      ctx.logger.warn(err.errors);
      ctx.body = {
        ...Status(404, err.errors)
      }
      return;
    }
    return ctx.model.transaction(async t => {  //涉及到增删改的必须包裹事务,遇到错误可以自动回滚。
      // this.t = t; //创建事务  可以手动回滚或者提交 例如 this.t.commit() || this.t.rollback()
      // const count = await ctx.service.user.find(ctx.request.body);
      const result = await ctx.service.user.entry(t);
      ctx.body = {
        ...result
      }
      ctx.status = 200;
      return;
    })
  }

  /**
   * 获取绑定地址接口
   */
  public async isShow() {
    const { ctx } = this;
    try {
      ctx.validate(ValRule.ISSHOW_RULE);
    } catch (err) {
      ctx.logger.warn(err.errors);
      ctx.body = {
        ...Status(404, err.errors)
      }
      return;
    }

    const result = await ctx.service.user.showinfo();
    ctx.body = {
      ...result
    }
    ctx.status = 200;
    return;
  }

  /**
   * 发送短信接口
   */
  public async sendSms() {
    const { ctx } = this;
    try {
      ctx.validate(ValRule.SENDSMS_RULE);
    } catch (err) {
      ctx.logger.warn(err.errors);
      ctx.body = {
        ...Status(404, err.errors)
      }
      return;
    }

    return ctx.model.transaction(async t => {
      // this.t = t;
      const result = await ctx.service.user.sms(t);
      console.log("CONTROLLER", result);
      ctx.body = {
        ...result
      }
      ctx.status = 200;
      return;
    });

  }
}
