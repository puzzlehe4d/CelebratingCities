var uber = require('./config/uberAuthConfig.js');

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
        console.log(access_token, refresh_token)
        uber.user.getProfile(function(err, res) {
          console.log(res)
        })
        // store the user id and associated access token
        // redirect the user back to your actual app
        response.redirect('/#/tab/dash');
      }
    });

    console.log(request.sessionId)
  });
  

};
