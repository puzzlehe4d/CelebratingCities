var uber = require('./config/uberAuthConfig.js');
var userController = require('./db/userController.js');
var hubController = require('./db/hubController.js');
var rideController = require('./db/rideController.js');
var crimeController = require('./db/crimeController.js');
var db = require('./config/dbConfig.js');
var socrata = require('./config/socrataConfig.js');
module.exports = function (app, redisClient) {

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
        uber.user.getProfile(function(err, profile) {
          profile.access_token = access_token;
          profile.refresh_token = refresh_token;
          request.session.uuid = profile.uuid;
           // store the user id and associated access token
          userController.addUser(profile, function(err, res) {
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
  
  /*----------  route to check whether current user is authorized  ----------*/
  app.get('/api/auth/isLoggedIn', function(request, response) {
    response.status(200).send(request.session.isLoggedIn);
  });

  /*----------  route to logout current user  ----------*/
  app.get('/logout', function (request, response) {
    request.session.isLoggedIn = false;
    console.log('logging out...')
    response.redirect('/#/login');
  });

/*=====  End of AUTHORIZATION ROUTES  ======*/
 

/*=====================================
=        USER SPECIFIC ROUTES         =
=====================================*/

  /*----------  POST: add hub to specfic user  ----------*/
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
      });
    });
  });

  /*----------  GET: get user profile  ----------*/
  app.get('/api/user', function(request, response) {
    uber.user.getProfile(function(err, res) {
      if(err) {
        console.log(err)
      }
      response.status(200).send(res)
    });
  });

  /*----------  GET: get all hubs that belong to a specifc user id  ----------*/
  app.get('/api/:user/hubs', userController.getHubs);

/*=====  End of USER SPECIFIC ROUTES  ======*/



/*============================================
=            HUB SPECIFIC ROUTES            =
============================================*/

  /*----------  GET: get all hubs in database  ----------*/
  app.get('/api/hubs', hubController.getAllHubs);

  /*----------  POST: create hub in database  ----------*/
  app.post('/api/hubs', function(request, response) {
    hubController.createHub(request, response, redisClient, uber);
  });

  /*----------  GET: get hub by specifc hubID  ----------*/
  app.get('/api/hubs/:hubId', function(request, response) {
    hubController.getHubById(request.params.hubId, function(err, hub) {
      if(err) {
        response.status(500).send(err)
      } else {
        response.status(200).send(hub);
      }
    });
  });

  /*----------  GET: get hub by latitude and longitude  ----------*/
  app.get('/api/hubs/:lat/:lon', hubController.getHubsByGeoCode);

  /*----------  GET: get current rides for a specific hub  ----------*/
  
  app.get('/api/rides/:hub_id', rideController.getRidesByHubId);

/*=====  End of HUB SPECIFIC ROUTES    ======*/


/*================================================
=            UBER RIDE REQUEST ROUTES            =
================================================*/

  /*----------  GET: get all uber products by latitude and longitude  ----------*/
  app.get('/api/uber/products/:lat/:lon', function(request, response) {
    var lat = Number(request.params.lat);
    var lon = Number(request.params.lon);
    uber.products.getAllForLocation(lat, lon, function(err, products) {
      if (err) {
        console.error(err);
        response.status(500);
      } else {
        response.json(products);
      }
    });
  });

  /*----------  GET: get uber product info by id  ----------*/
  app.get('/api/uber/product/:id', function(request, response) {
    uber.products.getByID(request.params.id, function(err, product) {
      if (err) {
        console.error(err);
        response.status(500);
      } else {
        response.json(product);
      }
    });
  });

  /*----------  GET: get price estimates by uber product id and hub id  ----------*/
  app.get('/api/uber/estimate/:product_id/:hubId', function(request, response) {
    hubController.getHubById(request.params.hubId, function(err, hub){
      if(err) {
        console.log(err);
        response.status(500).send(err)
      }

      var coords = hub.attributes.geoRoute.split(', ')
      var start_latitude = coords[0];
      var start_longitude = coords[1];
      var end_latitude = coords[2];
      var end_longitude = coords[3];

      uber.estimates.getPriceForRoute(start_latitude, start_longitude, end_latitude, end_longitude, function(err, estimate) {
        if(err) {
          console.log(err)
          response.status(500).send(err);
        } else {
          response.status(200).json(estimate);
        }
      });
    });
  });

  /*----------  POST: request ride by uber product id + start & end latitude and longitude  ----------*/
  
  app.post('/api/uber/request', function(request, response) {
    uber.user.getProfile(function(err, profile) {
      if(err) {
        console.log('error getting profile', err);
        response.status(500).send(err);
      } else {
        userController.checkIfUserIsRiding(profile.uuid, function(err, status) {
          if(err) {
            console.log(err)
            // response.status(500).send(err);
          } 
          if(status.status) {
            response.status(201).send(status);
          } else {
            uber.requests.createRequest({
              "product_id": request.body.product_id,
              "start_latitude": Number(request.body.coordinates[0]),
              "start_longitude": Number(request.body.coordinates[1]),
              "end_latitude": Number(request.body.coordinates[2]),
              "end_longitude": Number(request.body.coordinates[3])
            }, function (err, res) {
              if (err) {
                console.log('error requesting ride',  err)
                request.session.isLoggedIn = false;
                console.log('logging out...')
                response.redirect('/#/login');
              } else {
                res.driver = 'John Smith';
                res.hub_id = request.body.hub_id;
                res.eta = 3;
                res.location = [39.54, -76.32];
                res.vehicle = 'Toyota Prius';
                res.status = 'accepted';
                res.surge_multiplier = 2;
                response.status(201).send(res);
                
                // mocking status for request ::not working::
                // uber.requests.setStatusByID(res.request_id, 'accepted', function (err, res) {
                //   if(err) {
                //     console.log('error mockign status', err);
                //   } else {
                //     response.status(201).send(res);
                //   }
                // });
                
              }
            });
          }
        })
      }
    });
  });

  app.post('/api/uber/rides', function(request, response) {
    uber.user.getProfile(function(err, profile) {
      if(err) {
        console.log('error getting profile', err);
        response.status(500).send(err);
      } else {
        request.body.uuid = profile.uuid;
      }
      
      rideController.createRide(request, response, function(err, ride) {
        if(err) {
          console.log('error creating ride', err);
          response.status(500).send(err);
        }
        response.status(201).send(ride);
      })
      
    });
    
  })

  
/*=====  End of UBER RIDE REQUEST ROUTES   ======*/
/*========================================
=            CRIME API ROUTES            =
========================================*/

  app.get('/api/crime/:lat/:lon', function (request, response) {
    crimeController.getCrimes(request, response, redisClient);
  });
/*=====  End of CRIME API ROUTES  ======*/


/*==================================================
 =            DATABASE MANAGEMENT ROUTES            =
 ==================================================*/
 
  /*----------  GET: route that resets and seeds database  ----------*/
  
  app.get('/api/resetDBWithData', function (request, response) {
    db.resetEverythingPromise().then(function(){
      return hubController.seedWithData(redisClient);
    }).then(function() {
      response.status(201).send('successfully reset db with data');
      return;
    }).catch(function(err){
      response.status(500).send(err);
      return;
    });
  });
 
 /*=====  End of DATABASE MANAGEMENT ROUTES  ======*/

};
