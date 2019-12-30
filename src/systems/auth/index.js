module.exports = (svr, router) => {
  const hasher = require("password-hash");
  
  let auth = router.route('auth');

  auth.post('login', async ctx => {
    let hashedPass = hasher.generate(ctx.body.pass);

    let ac = await svr.findActor({ 'storage.password': hashedPass, 'storage.name': ctx.body.name });
    if (!ac) {
      return ctx.setError('Not found');
    }
    await ctx.from.setActor(ac);
    await ac.setEnabled(true).setName(ctx.body.name);
  });

  auth.post('register', async ctx => {
    let regName = /^[A-Z](['-][a-zA-Z])?[a-z0-9]+?(\s[A-Z](['-][a-zA-Z])?[a-z0-9]+)?$/;
    let regPass = /[\w-]{6,}$/;
    
    if (regName.test(ctx.body.name) && regPass.test(ctx.body.pass)) {
      let hashedPass = hasher.generate(ctx.body.pass);
      let hashedEmail = hasher.generate(ctx.body.email);

      let ac = await svr.createActor()
        .setPos(-94445.5938, 60036.1406, -12741.3779)
        .setAngle(0, 0, 0)
        .setCellOrWorld(0x3c)
        .setEnabled(true)
        .setStorage({ password: hashedPass, name: ctx.body.name, email: hashedEmail })
        .setName(ctx.body.name)
        .setRaceMenuOpen(true)

      await ctx.from.setActor(ac);
    } else {
      console.log("Invalid auth!");
    }
  });

  auth.get('actor', async ctx => {
    let ac = await ctx.from.getActor();
    ctx.setResult(ac ? ac.getId() : null);
  });

  svr.on('userExit', async user => {
    let ac = await user.getActor();
    if (ac) {
      await ac.setEnabled(false);
    }
  });
};
