import { EggAppConfig, PowerPartial } from 'egg';

// for config.{env}.ts
export type DefaultConfig = PowerPartial<EggAppConfig & BizConfig>;

// app special config scheme
export interface BizConfig {
  sourceUrl: string;
}

export default (appInfo: EggAppConfig) => {
  const config = {} as PowerPartial<EggAppConfig> & BizConfig;

  config.cluster = {
    listen: {
      port: 8080,
      hostname: '127.0.0.1',
      // path: '/var/run/egg.sock',
    }
  }

  // app special config
  config.sourceUrl = `https://github.com/eggjs/examples/tree/master/${appInfo.name}`;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name+ '_1525776408250_52812';

  // add your config here
  config.middleware = [];

  config.bodyParser = {
    jsonLimit: '1mb',
    formLimit: '1mb',
  },

  //安全协议
  config.security = {
    csrf:{
      enable: false //安全协议(false:关闭,true:开启)
    }
  };

  config.sequelize = {
    dialect: 'postgres', // support: mysql, mariadb, postgres, mssql
    database: 'blocktest',
    host: 'localhost',
    port: '5432',
    username: 'postgres',
    password: 'etz.123456',
    pool: {
      max: 100,
      min: 10,
      acquire: 30000,
      idle: 10000
    }
  };

  config.alisms = {
    AccessKeyID:'xxx',
    AccessKeySecret:'xxx',
    SignName:'xxx',
    TemplateCode:{
      GET_SMS_CODE:['SMS_131340057','绑定地址验证码'] //获取短信验证码模板ID  验证码${code}，您正在尝试变更重要信息，请妥善保管账户信息。
    }
  };

  config.teleg = {
    //588723717:AAGOXk4Xr0XjYrsxJL1XkxuJD5u8e3sspnM
    token:"45510953:AAEE83IspJEURpSa3HfNHPrWbjQlqKUZESg",
    showurl:"https://blockoptions.com/airdrop"
  };

  config.cors = {
    origin:'*',
    allowMethods:'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials:true
  }

  return config;
};
