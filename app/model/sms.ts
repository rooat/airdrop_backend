
import { Status, StatusCode, Moment } from '../utils';
module.exports = app => {
  const { STRING, INTEGER, TEXT } = app.Sequelize;

  const Sms = app.model.define('etz_sms_information', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    country_code: {
      type: STRING(20),
      comment: "国家码"
    },
    phone: {
      type: STRING(100),
      comment: "手机号"
    },
    bizid: {
      type: STRING(100),
      comment: "发送流水号"
    },
    random: {
      type: STRING(100),
      comment: "随机数"
    },
    content: {
      type: STRING(500),
      comment: "短信内容"
    },
    send_date: {
      type: STRING(23),
      comment: "发送时间"
    },
    receive_date: {
      type: STRING(23),
      comment: "接收时间"
    },
    type: {
      type: STRING(50),
      comment: "类别"
    },
    status: {
      type: STRING(20),
      comment: "状态"
    },
    enter_person: {
      type: STRING(50),
      comment: "录入人"
    },
    enter_time: {
      type: STRING(23),
      comment: "录入时间"
    },
    remark: {
      type: TEXT,
      comment: "备注"
    }
  },
    {
      tableName: 'etz_sms_information',  //一定要设置表名，不然有重复的表会建成其他名字
      timestamps: false  //是否增加created_at,updated_at
    }
  );

  Sms.checkSms = async function (data) {
    const { phonenum, random, status } = data;
    const result = await this.findOne({   //查找有没有对应手机号的验证码
      where: {
        phone: phonenum,
        random: random,
        status: status
      },
      order: [
        ['enter_time', 'DESC']
      ]
    });

    if (!result || result.length == 0) {  //没有数据时是null值
      return {
        ...Status(600, StatusCode.NO_DATE_IS_QUERY)
      }
    }

    return {
      ...Status(201, result || [])
    };
  }


  Sms.check = async function (data) {
    const { phonenum, country_code, status } = data;
    const result = await this.findOne({   //查找有没有相同的
      where: {
        phone: phonenum,
        country_code: country_code,
        status: status
      },
      order: [
        ['enter_time', 'DESC']
      ]
    });

    if (!result || result.length == 0) {  //没有数据时是null值
      return {
        ...Status(600, StatusCode.NO_DATE_IS_QUERY)
      }
    }

    return {
      ...Status(201, result || [])
    };
  }

  Sms.insert = async function (data) {
    const { phonenum, country_code, random, bizid, type, status, content, remark } = data;
    const result = await this.bulkCreate([
      {
        phone: phonenum,
        country_code: country_code,
        random: random,
        content: content,
        status: status,
        type: type,
        bizid: bizid,
        enter_person: 'System',
        enter_time: Moment().format('YYYY-MM-DD HH:mm:ss'),
        remark: remark
      }
    ]);
    return result || {};
  }


  return Sms;
};