import { Moment } from '../utils';
module.exports = app => {
    const { STRING, INTEGER} = app.Sequelize;

    const Airdropten = app.model.define('air_drop_20180621', {
        address: {
            type: STRING(100),
            primaryKey: true
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
            tableName: 'air_drop_20180621',  //一定要设置表名，不然有重复的表会建成其他名字
            timestamps: false  //是否增加created_at,updated_at
        }
    );

    Airdropten.insert = async function (data) {
        const { address} = data;
        const result = await this.bulkCreate([
            {
                address: address,
                state: 0,
                txhash: "0x00",
                createat: Moment().format('YYYY-MM-DD HH:mm:ss'),
                updateat: Moment().format('YYYY-MM-DD HH:mm:ss')
            }
        ]);
        return result || {};
    }


    return Airdropten;
};
