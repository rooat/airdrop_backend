import { Service } from 'egg';
import { CommUtil, Status, StatusCode } from '../utils';




export default class Telegram extends Service {
  body: any;
  constructor(ctx) {
    super(ctx); //如果需要在构造函数做一些处理，一定要有这句话，才能保证后面 `this.ctx`的使用。
    // 就可以直接通过 this.ctx 获取 ctx 了
    // 还可以直接通过 this.app 获取 app 了
    this.body = ctx.request.body;
  }

  /**
   * 处理telegram的事件
   * @param body
   * @param t
   */
  public async entry(body, t) {
    console.log('来自电报群的信息:',body.message);
    console.log('来自电报群的信息1:',body.message.from);
    console.log('来自电报群的信息2:',body.message.chat);
    if(body.message.text.indexOf("adv")!=-1){
        return body.message.chat.id+","+body.message.from.id+",adv";
    }
    const { ctx,config } = this;
    const {id} = body.message.from;
    const text = (body.message.text).replace("/", '');

    // let ress = await telegram.kickChatMember(-1001362275214, 614257236);
    // console.log("ress:",ress)


    let atname = '';
    const { first_name, last_name, username } = body.message.chat;
    first_name ? atname = first_name + " " + last_name : null
    last_name ? atname = first_name + " " + last_name : null
    username ? atname = username : null
    // console.log("获取信息:", body);
    const resA = await this.ctx.model.User.checkCode({
      invite_code: text
    })
    this.logger.info("username:"+username,",telid:"+id);
    this.logger.info("拿到的code:",text);
    this.logger.info("数据",resA);

    if (resA.sqlstatus == 'Failed') {
      return `@${atname} Your invitation code is invalid \n\n 您的邀请码无效`;
    }

      const resB = await this.ctx.model.User.checktelid({
        telid: String(id),
        tran: t
      })
      if(resB.sqlstatus == 'Success'){
        // console.log(resB);

        if(resB.fields.telid === String(id)){
          return `@${atname} You have been bound to other addresses without repeated bindings \n\n 你已经绑定其他地址，无需重复绑定 \n\n  Your share link （你的分享链接): ${config.teleg.showurl}?code=${text}`;
        }
      }


    try {

      await ctx.model.User.updateid({
        telid: id,
        code:text,
        tran: t
      })
      const resC = await this.ctx.model.Recommend.updaterecon({
         phone_address:resA.fields.receive_address,
         type:'推荐奖励',
         status: '已激活',
         tran: t
      })
      const resD = await ctx.model.Recommend.updatail({
        code: text,
        type: '个人奖励',
        status: '已激活',
        tran: t
      })
       ctx.model.Airdropten.insert({
        address: resA.fields.receive_address
      }).catch()
       ctx.model.Airdropetz.insert({
        address: resA.fields.receive_address,
        value:"10000000000000000"
      }).catch()
      console.log("resC:",resC);
      if (resC.fields[0] > 0 && resD.fields[0] > 0 ) {
        return `@${atname} Your code:${text} is activated successfully. You got 3000 BO，invited one friend = 3000 BO! Send shared link to your friend right away to get more BO！ \n\n 你的验证码：${text}，已激活成功！您获得了3000 BO，邀请一位朋友 = 3000 BO! 立刻发送分享链接给朋友获得海量BO奖励！\n\n Your share link （你的分享链接): ${config.teleg.showurl}?code=${text}`
      }
      else {
        return `@${atname} Your code activation failed,Please try again later \n\n 您的邀请码激活失败,请稍后重试`;
      }
    } catch (err) {
      ctx.logger.error(err);
      return `@${atname} The server is busy,Please try again later \n\n 服务器繁忙，请稍后再试`;
    }



  }

  /**
   * 绑定地址接口
   */
  public async bindWallet(t) {
    const { ctx } = this;
    const { address, code,ip } = this.body;
    const getrandom = CommUtil.randomRange();
    const resA = await ctx.model.User.findinfo({
      address: address
    })
    console.log("resA", resA);
    if (resA.sqlstatus == 'Success') {
      return {
        ...Status(200, null),
        code: resA.fields.invitecode,
      }
    }
    const resB = await ctx.model.User.findcode({
      random: getrandom,
    })
    //console.log("resB",resB);
    if (resB.sqlstatus == 'Success') {
      return {
        ...Status(404, StatusCode.NETWORK_IS_BUSY)
      }
    }

    if (code) {
      const resC = await ctx.model.User.findcode({
        random: code,
      })
      //console.log("resB",resB);
      if (resC.sqlstatus == 'Failed') {
        return {
          ...Status(404, StatusCode.RANDOM_IS_NOTEXISTED)
        }
      }

      const phone_address = resC.fields.address;


      try {
        await ctx.model.User.insert({
          receiveaddress: address,
          random: getrandom,
          tran: t,
          ip:ip
        })
        await ctx.model.Recommend.insertat({
          phone_address: address,
          phone_coin: '3000',
          recommend_address: phone_address,
          recommend_coin: '3000',
          code: getrandom,
          rcode:code,
          type: '推荐奖励',
          gettype:'个人奖励',
          status: '未激活',
          tran: t
        })

      } catch (err) {
        ctx.logger.error(err);
        return {
          ...Status(404, StatusCode.NETWORK_IS_BUSY)
        }
      }
      return {
        ...Status(200, null),
        code: getrandom
      }
    }

    return {
      ...Status(404, StatusCode.NETWORK_IS_BUSY)
    }

  }

  /**
   * 获取邀请人数业务层
   */
  public async showinvite(t){
    const { ctx } = this;
    const { code } = this.body;
    const resA = await ctx.model.User.findcode({
      random: code,
      tran: t
    })
    // console.log(resA);
    if(resA.sqlstatus == 'Failed' && resA.failure_reason == '无数据'){
      return {
        ...Status(404, StatusCode.RANDOM_IS_NOT_EXISTED)
      }
    }

    const { address } = resA.fields

    const resB = await ctx.model.Recommend.showinvite({
      address: address,
      tran: t
    })
    // console.log(resB);

    const resC = await ctx.model.Recommend.showgetcon({
      address: address,
      type:'推荐奖励',
      status:'已激活',
      tran: t
    })
    // console.log(resC);

    const resD = await ctx.model.Recommend.persongetcon({
      code: code,
      type:'个人奖励',
      status:'已激活',
      tran: t
    })
    // console.log(resD);
    let getetzcon = resC.fields[0].sum

    let persongetcon = resD.fields[0].sum
    console.log("getetzcon=======",getetzcon);
    console.log("persongetcon1=======",persongetcon);

    !persongetcon || Number(resD.fields[0].sum).toFixed(0) == '0' ?
    persongetcon = 0 : persongetcon = Number(Number(resD.fields[0].sum).toFixed(1))
    console.log("persongetcon2=======",persongetcon);


      if(getetzcon==null){
        getetzcon=0;
      }
      getetzcon=parseFloat(getetzcon)+parseFloat(persongetcon);

  //  !getetzcon ? getetzcon = '0' : getetzcon = (Number(getetzcon)+Number(persongetcon)).toFixed(1)

    console.log("getetzcon=======",getetzcon);

    let invitenum = resB.fields.length;
    invitenum > 0 && invitenum ? invitenum = invitenum + "" : invitenum = '0'


    return {
      ...Status(200, null),
      getetzcon:getetzcon,
      invitenum:invitenum
    }
  }
}
