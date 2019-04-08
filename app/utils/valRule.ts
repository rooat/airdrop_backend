/**
 * 定义创建接口的请求参数规则
 */
const createRule = {
      /**
       * 推荐码注册请求规则
       */
      CREATE_RULE:{ 
        phonenum: {type: 'string', min: 5,max:11},
        country_code: 'string',
        random: 'string',
        receiveaddress:'string'
      },
      /**
       * 展示已绑定手机号地址的用户请求规则
       */
      ISSHOW_RULE:{
        address:'string',
      },
      /**
       * 发送手机验证码
       */
      SENDSMS_RULE:{
        country_code:{type: 'string', min: 1,max:4},
        phonenum:{type: 'string', min: 5,max:11}
      },
      /**
       * 绑定地址新活动
       */
      BIND_ADDRESS_RULE:{
        address:{type: 'string', required: true, allowEmpty: false,min: 42,max:42},
        code:{type: 'string', required: true, allowEmpty: true}
      },
      /**
       * 获取邀请人数规则
       */
      GET_INVITE_RULE:{
        code:{type: 'string', required: true, allowEmpty: false,min: 10,max:10}
      },

}

export default createRule;