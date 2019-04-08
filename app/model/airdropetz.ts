import { Moment } from '../utils';
module.exports = app => {
    const { STRING, INTEGER} = app.Sequelize;

    const Airdropetz = app.model.define('air_drop_etz001', {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        address: {
            type: STRING(100)
        },
        value: {
            type: STRING(100)
        },
        state: {
            type: INTEGER
        },
        txhash: {
            type: STRING(100)
        },
        createat: {
            type: STRING(23)
        },
        updateat: {
            type: STRING(23)
        }
    },
        {
            tableName: 'air_drop_etz001',  //一定要设置表名，不然有重复的表会建成其他名字
            timestamps: false  //是否增加created_at,updated_at
        }
    );

    Airdropetz.insert = async function (data) {
        const { address,value} = data;
        const result = await this.bulkCreate([
            {
                address: address,
                value: value,
                state:0,
                txhash:"0x000",
                createat:Moment().format('YYYY-MM-DD HH:mm:ss'),
                updateat:Moment().format('YYYY-MM-DD HH:mm:ss')
            }
        ]);
        return result || {};
    }


    return Airdropetz;
};
