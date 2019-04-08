import { Status, Moment } from '../utils';
/**
 * 推荐表model
 */
module.exports = app => {
  const { STRING, INTEGER, DECIMAL,fn,col } = app.Sequelize;

  const Recommend = app.model.define('etz_recommend_record', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phone: {
      type: STRING(100),
      comment: "下载人的手机号"
    },
    phone_address: {
      type: STRING(100),
      comment: "下载人地址"
    },
    phone_coin: {
      type: DECIMAL(23, 10),
      comment: "下载人得到的etz"
    },
    recommend_phone: {
      type: STRING(50),
      comment: "推荐人的手机号"
    },
    recommend_address: {
      type: STRING(100),
      comment: "推荐人地址"
    },
    recommend_coin: {
      type: DECIMAL(23, 10),
      comment: "推荐人得到的etz"
    },
    invite_code: {
      type: STRING(20),
      comment: "关联的邀请码"
    },
    type: {
      type: STRING(20),
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
    sended :{
      type:STRING(2),
      comment:"标记"
    }
  },
    {
      tableName: 'etz_recommend_record',
      timestamps: false
    }
  );

  Recommend.showList = async function () {
    const result = await this.findAll();
    return result || {};
  }

  Recommend.showinvite = async function (data){
    const { address } = data
    const result = await this.findAll({
      where: {
        recommend_address: address
      }
    })

    return {
      ...Status(201, result)
    }
  }

  Recommend.showgetcon = async function (data){
    const { address,status,type } = data
    const result = await this.findAll(
      {
        where:{
        lower(ecommend_address):address,
        type:type,
        status:status
      },
      attributes:[[fn('SUM', col('recommend_coin')), 'sum']],
      raw:true
    }

    )

    return {
      ...Status(201, result)
    }
  }

  Recommend.persongetcon = async function (data){
    const { code,status,type } = data
    const result = await this.findAll(
      {
        where:{
        invite_code:code,
        type:type,
        status:status
      },
      attributes:[[fn('SUM', col('phone_coin')), 'sum']],
      raw:true}
    )

    return {
      ...Status(201, result)
    }
  }

  Recommend.insert = async function (data) {
    const { phone, phone_address, phone_coin, recommend_phone, recommend_address, recommend_coin, status, tran } = data
    const result = await this.bulkCreate([
      {
        phone: phone,
        phone_address: phone_address,
        phone_coin: phone_coin,
        recommend_phone: recommend_phone,
        recommend_address: recommend_address,
        recommend_coin: recommend_coin,
        status: status,
        enter_person: 'System',
        enter_time: Moment().format('YYYY-MM-DD HH:mm:ss')
      }
    ], { transaction: tran });

    return {
      ...Status(201, result)
    }
  }

  Recommend.insertat = async function (data) {
    const { phone_address,rcode,code, phone_coin, recommend_address, recommend_coin, status,type,gettype, tran } = data
    const result = await this.bulkCreate([
      {
        phone_address: phone_address,
        phone_coin: '0',
        recommend_address: recommend_address,
        recommend_coin: phone_coin,
        invite_code:rcode,
        status: status,
        type:type,
        enter_person: 'System',
        enter_time: Moment().format('YYYY-MM-DD HH:mm:ss')
      },
      {
        phone_address: phone_address,
        phone_coin: recommend_coin,
        status: status,
        invite_code:code,
        type:gettype,
        enter_person: 'System',
        enter_time: Moment().format('YYYY-MM-DD HH:mm:ss')
      }
    ], { transaction: tran });

    return {
      ...Status(201, result)
    }
  }

  Recommend.updatail = async function (data) {
    const {  code, status,type, tran } = data
    const result = await this.update(
      {
        status: status
      }, {
        where: {
          invite_code: code,
          type:type
        }, transaction: tran
      });

    return {
      ...Status(201, result)
    }
  }

  Recommend.updaterecon = async function (data) {
    const {  phone_address,status,type, tran } = data
    const result = await this.update(
      {
        status: status
      }, {
        where: {
          phone_address:phone_address,
          type:type
        }, transaction: tran
      });

    return {
      ...Status(201, result)
    }
  }


  return Recommend;
};
