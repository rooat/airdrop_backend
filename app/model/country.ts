
//国家码表model
module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const Country = app.model.define('etz_country', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    belong: {
      type: STRING(100),
      comment: "所属"
    },
    country: {
      type: STRING(30),
      comment: "国家及地区"
    },
    country_code: {
      type: STRING(20),
      comment: "国家码"
    },
    enter_person: {
      type: STRING(50),
      comment: "录入人"
    },
    enter_time: {
      type: STRING(23),
      comment: "录入时间"
    }
  },
    {
      tableName: 'etz_country',
      timestamps: false
    }
  );

  Country.showList = async function () {
    const result = await this.findAll();
    return result || {};
  }

  Country.findCode = async function (data) {
    const { country_code } = data;
    const result = await this.findAll({
      where: {
        country_code: country_code
      }
    });
    return result || {};
  }


  return Country;
};