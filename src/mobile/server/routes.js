var uber = require('./config/uberAuthConfig.js');
var userController = require('./db/userController.js');
var hubController = require('./db/hubController.js');
var db = require('./config/dbConfig.js');
module.exports = function (app) {

/*============================================
=            AUTHORIZATION ROUTES            =
============================================*/
/*----------  Uber OAUTH 2.0 Authentication Route ----------*/
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

/*----------  Uber OAUTH 2.0 callback route  ----------*/
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
        request.session.uuid = res.uuid;
         // store the user id and associated access token
        userController.addUser(res, function(err, res) {
          if(err) {
            console.log(err)
          }

        });
      });
     
      // redirect the user back to app
      response.redirect('/#/tab/start');
    }
  });
});
/*=====  End of AUTHORIZATION ROUTES  ======*/


  

  // 
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
  app.get('/api/hubs/:hubId', function(req, res) {
    hubController.getHubById(req.params.hubId, function(err, hub) {
      if(err) {
        res.status(500).send(err)
      } else {
        res.status(200).send(hub);
      }
    })
  });
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
    var lat = Number(req.params.lat);
    var lon = Number(req.params.lon);
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
  app.get('/api/uber/estimate/:product_id/:hubId', function(req, res) {
    hubController.getHubById(req.params.hubId, function(err, hub){
      if(err) {
        console.log(err);
        res.status(500).send(err)
      }
      var start_latitude = hub.attributes.geoRoute.split(', ')[0];
      var start_longitude = hub.attributes.geoRoute.split(', ')[1];
      var end_latitude = hub.attributes.geoRoute.split(', ')[2];
      var end_longitude = hub.attributes.geoRoute.split(', ')[3];
      uber.estimates.getPriceForRoute(start_latitude, start_longitude, end_latitude, end_longitude, function(err, response) {
        if(err) {
          console.log(err)
          res.status(500).send(err);
        } else {
          res.json(response);
        }
      });
    })

  });

  app.post('/api/uber/request', function(req, res) {
    uber.requests.createRequest({
      "product_id": req.body.product_id,
      "start_latitude": Number(req.body.coordinates[0]),
      "start_longitude": Number(req.body.coordinates[1]),
      "end_latitude": Number(req.body.coordinates[2]),
      "end_longitude": Number(req.body.coordinates[3])
    }, function (err, response) {
      if (err) {
        console.log(err)
        res.status(500).send(err);
      } else {
        res.status(201).send(response);
      }
    });
  })
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
