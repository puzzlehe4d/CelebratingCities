var uber = require('./config/uberAuthConfig.js');
var userController = require('./db/userController.js');
var hubController = require('./db/hubController.js');
var db = require('./config/dbConfig.js');
module.exports = function (app) {
  app.get('/auth/uber', function(request, response) {
    if(process.env.TEST) {
      request.session.isLoggedIn = true;
      var userObject = {
        picture:'mock picture',
        first_name:'mock first_name',
        last_name:'mock last_name',
        uuid:'mock uuid',
        rider_id:'mock rider_id',
        access_token:'mock access_token',
        refresh_token:'mock access_token'
      }
      userController.addUser(userObject, function(err, res) {
        if(err) {
          console.log(err)
        }
      });
      response.redirect('/#/tab/start');
    } else {
      var url = uber.getAuthorizeUrl(['history','profile', 'request', 'places']);
      response.redirect(url); 
    }
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
          res.access_token = access_token;
          res.refresh_token = refresh_token;
          userController.addUser(res, function(err, res) {
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

  app.post('/api/user/hubs', function(request, response) {
    uber.user.getProfile(function(err,res){
      if(err) {
        console.log(err)
      }
      userController.addHub(request.body, res, function(err, res) {
        if(err) {
          console.log(err)
        } 
        response.send(res);

      })
    })
  });

  app.get('/api/hubs', hubController.getAllHubs);
  app.post('/api/hubs', hubController.createHub);
  app.get('/api/hubs/:hubId', hubController.getHubById);
  app.get('/api/user', function(request, response) {
    uber.user.getProfile(function(err, res) {
      if(err) {
        console.log(err)
      }
      response.status(200).send(res)
    });
  });
  app.get('/api/:id/hubs', userController.getHubs);
  app.get('/api/uber/products/:lat/:lon', function(req, res) {
    // var lat = Number(req.params.lat);
    // var lon = Number(req.params.lon);
     var lat = Number(req.params.lat);
    var lon = Number(req.params.lon);
    console.log(lat, lon)
    uber.products.getAllForLocation(lat, lon, function(err, response) {
          if (err) {
            console.error(err);
            res.status(500);
          } else {
            res.json(response);
          }
      })
  })

  app.get('/api/uber/product/:id', function(req, res) {
    uber.products.getByID(req.params.id, function(err, response) {
      if (err) {
        console.error(err);
        res.status(500);
      } else {
        res.json(response);
      }
    })
  })
  app.get('/api/hubs/:lat/:lon', hubController.getHubsByGeoCode);

  app.get('/api/resetDBWithData', function (req,res) {
    db.resetEverythingPromise().then(function(){
      return hubController.seedWithData();
    }).then(function() {
      res.status(201).send('successfully reset db with data');
      return;
    }).catch(function(err){
      res.status(500).send(err);
      return;
    })
  })
  

};
