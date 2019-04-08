module.exports = (options, app) => {
  return async function (ctx, next) {
    console.log('options',options);
    try {
      let ret = await next();
      //ctx.cookies.set('csrfToken', ctx.csrf);
      ctx.rotateCsrfSecret();

      if (!ctx.body) {
        ctx.body = {
          success: true,
          data: ret,
        }
      }

      if (ctx.getTran()) {
        ctx.getTran().commit()
      }

    } catch (e) {
      ctx.body = {
        success: false,
        stack: app.config.env == 'local' ? e.stack : undefined,
        message: e.message,
      }

      if (ctx.getTran()) {
        ctx.getTran().rollback()
      }
    }
  };
};