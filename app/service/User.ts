import { Service } from 'egg';
import { Status, CommUtil, StatusCode, SMSClient, Moment } from '../utils';
/**
 * Country Service
 */
export default class User extends Service {
  t: any;
  body: any;
  // tran: any;
  //默认不需要提供构造函数。
  constructor(ctx) {
    super(ctx); //如果需要在构造函数做一些处理，一定要有这句话，才能保证后面 `this.ctx`的使用。
    // 就可以直接通过 this.ctx 获取 ctx 了
    // 还可以直接通过 this.app 获取 app 了
    this.body = ctx.request.body;
  }

  public async entry(t) {
    const { ctx } = this;
    const { country_code } = this.body;
    //return this.ctx.model.post.findAndCountAll();
    const resA = await ctx.model.Country.findCode({
      country_code: country_code
    });
    if (resA.length == 0) {
      return {
        ...Status(404, StatusCode.COUNTRY_ISNT_EXISTED)
      }
    }
    this.body.getrandom = CommUtil.randomnum(10000000, 99999999);
    this.body.country = resA[0].country;
    const resB = await this.check();
    console.log('res1', resB);
    if (resB.sqlstatus == 'Failed') {
      return {
        ...Status(404, resB.failure_reason)
      }
    }
    const { phonenum, receiveaddress, getrandom, country, rephone, readdress, invite_code } = this.body;
    if (!invite_code && invite_code != '') {
      try {
        const resC = await ctx.model.User.insert({
          phonenum: phonenum,
          receiveaddress: receiveaddress,
          random: getrandom,
          country: country,
          countrycode: country_code,
          tran: t
        })
        console.log("插入结果:", resC);

        let phone_coin = 1;
        let rephone_coin = 4;
        const resD = await ctx.model.Recommend.insert({
          phone: phonenum,
          phone_address: receiveaddress,
          phone_coin: phone_coin,
          recommend_phone: rephone,
          recommend_address: readdress,
          recommend_coin: rephone_coin,
          status: '未结算',
          tran: t
        })
        console.log("插入结果:", resD);
        return {
          ...Status(200, ''),
          data:{
            invite_code: resC[0].invite_code,
            address: resC[0].receive_address,
            phone: resC[0].phone
          }
        }
      } catch (err) {
        ctx.logger.error(err);
        return {
          ...Status(404, StatusCode.NETWORK_IS_BUSY)
        }
      }

    } else {
      try {
        const resC = await ctx.model.User.insert({
          phonenum: phonenum,
          receiveaddress: receiveaddress,
          random: getrandom,
          country: country,
          countrycode: country_code,
          tran: this.t
        })
        console.log("插入结果:", resC);

        let phone_coin = 5;
        const resD = await ctx.model.Recommend.insert({
          phone: phonenum,
          phone_address: receiveaddress,
          phone_coin: phone_coin,
          status: '未结算',
          tran: this.t
        })
        console.log("插入结果:", resD);
        return {
          ...Status(200, ''),
          data:{
            invite_code: resC[0].invite_code,
            address: resC[0].receive_address,
            phone: resC[0].phone
          }
        }
      } catch (err) {
        ctx.logger.error(err);
        return {
          ...Status(404, StatusCode.NETWORK_IS_BUSY)
        }
      }
    }

  }

  private async check() {
    let nowtime = Moment().format('YYYY-MM-DD HH:mm:ss')
    const { phonenum, receiveaddress, random, invite_code } = this.body;
    if (invite_code && invite_code != '') {

      const resA = await this.ctx.model.User.checkCode({
        invite_code: invite_code
      })

      if (resA.sqlstatus == 'Failed') {
        return {
          ...Status(600, StatusCode.RANDOM_IS_NOTEXISTED)
        }
      }
      if (resA.fields.phone == phonenum) {
        return {
          ...Status(600, StatusCode.PHONE_IS_EXISTED)
        }
      }
      this.body.rephone = resA.fields.phone;
      this.body.readdress = resA.fields.receive_address;
    }


    const resB = await this.ctx.model.Sms.checkSms({
      phonenum: phonenum,
      random: random,
      status: '发送短信成功',
      subtime: nowtime
    })
    if (resB.sqlstatus == 'Failed') {
      return {
        ...Status(600, StatusCode.VERIFICATION_IS_ERROR)
      }
    }
    const differ = CommUtil.timeSecond(nowtime, resB.fields.enter_time)
    console.log('相差时间', differ)
    if (differ > 600) {  //超过10分钟后验证码失效，需要重新获取
      return {
        ...Status(600, StatusCode.VERIFICATION_IS_INVALID)
      }
    }
    // console.log('获取短信验证', resA)
    const res = await this.ctx.model.User.check({
      phonenum: phonenum,
      receiveaddress: receiveaddress
    });
    return res;
  }



  public async showinfo() {
    const { ctx } = this;
    const { address } = this.body;
    const res = await ctx.model.User.findinfo({
      address: address
    })
    if (res.sqlstatus == 'Failed') {
      return {
        ...Status(404, res.failure_reason),
        fields: []  //没查到值就返回空数组
      }
    }
    // console.log("查询结果:", res);
    return {
      ...Status(200, ''),
      fields: [res]
    }
  }

  public async sms(t) {
    const { ctx } = this;
    const { phonenum, country_code } = this.body;
    this.logger.info('config', this.config.alisms);
    const smsnum = 60;  //每个手机号的间隔时间
    const conf = this.config.alisms;
    let smsClient = new SMSClient({  //初始化sms_client
      accessKeyId: conf.AccessKeyID,
      secretAccessKey: conf.AccessKeySecret
    })
    const randomCode = CommUtil.randomnum(100000, 999999);
    const resA = await ctx.model.Sms.check({
      phonenum: phonenum,
      country_code: country_code,
      status: '发送短信成功'
    })
    if (resA.sqlstatus == 'Success') {
      var differ = await CommUtil.timeSecond(Moment().format('YYYY-MM-DD HH:mm:ss'), resA.fields.enter_time);
      console.log("相差秒数:", differ);
      if (differ < smsnum) {
        const leavenum = smsnum - differ;
        return {
          ...Status(404, `${StatusCode.SMS_IS_OFTEN},请${leavenum}秒后重试`)
        }
      }
    }
    try {
      var res = await smsClient.sendSMS({   //发送短信
        PhoneNumbers: `00${country_code}${phonenum}`,
        SignName: conf.SignName,
        TemplateCode: conf.TemplateCode.GET_SMS_CODE[0],
        TemplateParam: `{"code":${randomCode}}`
      })
    } catch (err) {
      console.log("捕获错误", err.data.Message);
      await ctx.model.Sms.insert({
        phonenum: phonenum,
        country_code: country_code,
        random: randomCode,
        type: conf.TemplateCode.GET_SMS_CODE[1],
        status: '发送短信失败',
        remark: err.data.Message,
        tran: t
      })
      // console.log("发送短信失败插入返回结果", resB);
      return {
        ...Status(404, err.data.Message)
      };
    }

    console.log("XXX", res);

    //成功发送成功后插入一条记录
    if (res && res.Code == 'OK') {
      await ctx.model.Sms.insert({
        phonenum: phonenum,
        country_code: country_code,
        random: randomCode,
        type: conf.TemplateCode.GET_SMS_CODE[1],
        status: '发送短信成功',
        bizid: res.BizId,
        remark: JSON.stringify(res),
        tran: t
      })
      // console.log("发送短信成功插入返回结果", resC);


      return {
        ...Status(200, '')
      }
    }

  }
}

