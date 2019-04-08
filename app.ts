

module.exports = app => {
  //if (app.config.env === 'local') {
    app.beforeStart(async () => {
      const ctx = await app.createAnonymousContext();  //创建匿名参数
      await app.startbot(ctx);
      await app.model.sync({ force: true });
    });
//  }
};
