var uber = require('./config/uberAuthConfig.js');
var User = require('./db/userController.js');

module.exports = function (app) {
  app.get('/auth/uber', function(request, response) {
    var url = uber.getAuthorizeUrl(['history','profile', 'request', 'places']);
    response.redirect(url);
  });

  app.get('/auth/uber/callback', function(request, response) {
    uber.authorization({
      authorization_code: request.query.code
    }, function(err, access_token, refresh_token) {
      if (err) {
        console.error(err);
      } else {
        request.session.isLoggedIn = true;
        uber.user.getProfile(function(err, res) {
          User.addUser(res, function(err, res) {
            if(err) {
              console.log(err)
            }
          });
        });
        // store the user id and associated access token
        // redirect the user back to your actual app
        response.redirect('/#/tab/start');
      }
    });
  });

  app.get('/api/auth/isLoggedIn', function(req, res) {
    res.status(200).send(req.session.isLoggedIn);
  })
  app.get('/logout', function (req, res) {
    req.session.isLoggedIn = false;
    console.log('logging out...')
    res.redirect('/');
  });
  

};
