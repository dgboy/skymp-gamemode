setTimeout(() => {
  let state = {
    resolves: {}
  };

  window.skymp.on('customPacket', p => {
    if (p && p.id) {
      let { id } = p;
      if (state.resolves[id]) {
        state.resolves[id](p);
        delete state.resolves[id];
      }
    }
  });

  let request = window.skympRequest.createRequestSource({
    send(target, customPacket) {
      window.skymp.sendCustomPacket(customPacket);
    },
    receive(id) {
      return new Promise(resolve => {
        state.resolves[id] = resolve;
      });
    }
  });

  let hideAuth = () => {
    let ids = ['id_myactor', 'id_name', 'id_pass', 'id_email', "id_login", 'id_register'];
    ids.forEach(id => document.getElementById(id).style.visibility = 'hidden');
  }

  onLogin = () => {
    let name = document.getElementById('id_name').value;
    let pass = document.getElementById('id_pass').value;
    request({
      route: 'auth/login',
      body: { name, pass }
    }).then(() => {
      console.log('logged in successfully');
      hideAuth();
    }).catch(e => alert(e));
  };

  onRegister = () => {
    let name = document.getElementById('id_name').value;
    let pass = document.getElementById('id_pass').value;
    let email = document.getElementById('id_email').value;

    request({
      route: 'auth/register',
      body: { name, pass, email }
    }).then(() => {
      console.log('registered successfully');
      hideAuth();
    }).catch(e => alert(e));
  };

  (async () => {
    while (1) {
      let v;
      try {
        v = await request({ route: 'auth/actor', type: 'get' });
      }
      catch(e) {
        v = e.toString();
      }
      document.getElementById('id_myactor').innerHTML = v;
    }
  })();

}, 200);


document.addEventListener('keydown', function(event) {
  console.log({event})
  if (event.key == '4') {
    window.skymp.sendCustomPacket({
      type: 'playAnim'
    });
  }
  if (event.key == '5') {
    window.skymp.sendCustomPacket({
      type: 'tp'
    });
  }
  if (event.key == '6') {
    window.skymp.sendCustomPacket({
      type: 'rotate'
    });
  }
});
