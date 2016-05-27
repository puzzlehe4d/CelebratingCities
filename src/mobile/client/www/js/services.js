angular.module('RideHUB.services', [])

/*====================================
=            HUBS FACTORY           =
====================================*/

.factory('Hubs', function ($http, Geocoder) {

  /*----------  get all hubs from database: GET to /api/hubs ----------*/
  var getAllHubs = function () {
    return $http({
      method: 'GET',
      url: '/api/hubs'
    }).then(function(result){
      return result;
    }).catch(function(err){
      return err;
    });
  };

  /*----------  create hub in database: POST to /api/hubs  ----------*/
  var createHub = function (hub) {
    return $http({
      method: 'POST',
      url: '/api/hubs',
      data: {
        leaveTime: hub.leaveTime,
        recurring: hub.recurring,
        address: hub.address,
        endPoint: hub.endPoint,
        lat: hub.lat,
        lon: hub.lon,
        geoRoute: hub.geoRoute
      }
    }).then(function(result){
      return result;
    }).catch(function(err){
      return err;
    });
  };

  /*----------  get a hub from the databse by its id: GET to /api/hubs/:hubID  ----------*/
  var getHubById = function(hubId) {
    return $http({
      method: 'GET',
      url: '/api/hubs/' + hubId 
    }).then(function (result) {
      return result;
    }).catch(function (err) {
      return err
    })
  };

  /*----------  get a hub from the database by its start location (lat, long): GET to /api/hubs/:lat/:lon  ----------*/
  var getHubsByGeoCode = function(location) {
    return $http({
      method: 'GET',
      url: '/api/hubs/' + location.coords.latitude + '/' + location.coords.longitude
    }).then(function(response) {
      return response;
    }).catch(function(err) {
      return err;
    })
  };

  var getRidesByHubId = function (hub_id) {
    console.log(hub_id)
    return $http({
      method:'GET',
      url: '/api/rides/' + hub_id
    }).then(function(result){
      console.log(result)
      return result;
    }).catch(function(error) {
      return error;
    })
  }

  /*----------  export functions  ----------*/
  return {
    getAllHubs: getAllHubs,
    createHub: createHub,
    getHubById: getHubById,
    getHubsByGeoCode: getHubsByGeoCode,
    getRidesByHubId: getRidesByHubId
  }

})

/*=====  End of HUBS FACTORY ======*/


/*========================================
=            GEOCODER FACTORY            =
========================================*/

.factory('Geocoder', function($http, $q) {

  /*----------  get geo coordinates by address: GET to google maps api ----------*/
  var getGeoCode = function(address) {
    var baseUrl = "https://maps.google.com/maps/api/geocode/json";
    var address = address.split(' ').join('+');

    return $http({
      method: 'GET',
      url: baseUrl + '?address=' + address +"&key=AIzaSyCkSG2lTumeJ0awN_qxDoTj2Jenl2u3fUY"
    }).then(function(result) {
      return result;
    }).catch(function(err) {
      return err;
    })
  };

  var checkIfValidAddress = function(address) {
    var baseUrl = "https://maps.google.com/maps/api/geocode/json";
    var address = address.split(' ').join('+');

    return $http({
      method: 'GET',
      url: baseUrl + '?address=' + address +"&key=AIzaSyCkSG2lTumeJ0awN_qxDoTj2Jenl2u3fUY"
    }).then(function(result) {
      console.log(result)
      return result;
    }).catch(function(err) {
      return err;
    })
  };

  /*----------  get current address from current geo location: GET to google maps api  ----------*/
  var getAddress = function() {
    var baseUrl = "https://maps.google.com/maps/api/geocode/json";
    var getAddressFromGeo = function(coords) {
      var deferred = $q.defer();
      try {
        $http({
          method: "GET",
          url: baseUrl + "?sensor=false&latlng=" + encodeURIComponent(String(coords))
        }).then(function (response) {

          try {
            var json = response.data;
            if (json && json.results && json.results.length && json.results[0].formatted_address) {
              deferred.resolve(json.results[0].formatted_address);
            }
            else {  
              deferred.reject("Unexpected JSON response format: results[0].formatted_address not found");
            }
          }
          catch (ex) {
            deferred.reject("Cannot parse response as JSON");
          }
        }, deferred.reject);
      }
      catch (ex) {
        deferred.reject(ex.message);
      }

      return deferred.promise;
    }

    var deferred = $q.defer();

    if (navigator && navigator.geolocation && navigator.geolocation.getCurrentPosition) {
      navigator.geolocation.getCurrentPosition(function(position) {
        getAddressFromGeo([position.coords.latitude, position.coords.longitude]).then(function (address) {
          deferred.resolve(String(address));
        }, function () {
          deferred.reject("Could not find address for location");
        });
      }, function (error) { 
        deferred.reject(error); 
      }, {
          enableHighAccuracy: true,
          maximumAge: 10000
      });
    }

    return deferred.promise;
  };

  /*----------  export functions  ----------*/
  return {
    getGeoCode: getGeoCode,
    getAddress: getAddress,
    checkIfValidAddress: checkIfValidAddress
  }

})
/*=====  End of GEOCODER FACTORY  ======*/

/*=============================================
=            AUTHORIZATION FACTORY            =
=============================================*/

.factory('Authorization', function($http) {

  /*----------  check whether user is logged in: GET to /api/auth/isLoggedIn  ----------*/
  var isLoggedIn = function() {
    return $http({
      method: 'GET',
      url: '/api/auth/isLoggedIn'
    }).then(function(result){
      return result;
    }).catch(function(err){
      return err;
    })
  }

  var authorizeFakeUser = function (id) {
    return $http({
      method: 'POST',
      url: '/mock/auth/uber',
      data: {
        uuid: id
      }
    }).then(function(result) {
      return result;
    }).catch(function(err) {
      return err;
    })
  }

  /*----------  export functions  ----------*/
  return {
    isLoggedIn: isLoggedIn,
    authorizeFakeUser: authorizeFakeUser
  }

})

/*=====  End of AUTHORIZATION FACTORY  ======*/


/*======================================
=            USER FACTORIES            =
======================================*/

.factory('User', function($http) {

  /*----------  adds hub to specfic user: POST to /api/user/hubs ----------*/
  var addHub = function(id) {
    return $http({
      method: 'POST',
      url: '/api/user/hubs',
      data: {
        id: id
      }
    }).then(function(result){
      return result;
    }).catch(function(err){
      return err;
    })
  }

  /*----------  get user profile: GET to /api/user  ----------*/
  var getProfile = function () {
    return $http({
      method:'GET',
      url: '/api/user'
    }).then(function(result) {
      return result;
    }).catch(function(err) {
      return err;
    })
  }

  /*----------  get hubs that belong to specfic user: GET to /api/:user/hubs  ----------*/
  var getHubs = function(id) {
    return $http ({
      method:'GET',
      url: '/api/' + id + '/' + 'hubs'
    }).then(function(result) {
      return result;
    }).catch(function(err) {
      return err;
    })
  }

  /*----------  get current ride for a specific user: GET to /api/:user/ride  ----------*/
  var getCurrentRideByUserId = function(uuid) {
    return $http ({
      method:'GET',
      url: '/api/' + uuid + '/' + 'ride'
    }).then(function(result) {
      return result;
    }).catch(function(err) {
      return err;
    })
  }

  var joinRide = function (ride_id) {
    return $http ({
      method: 'POST',
      url:'/api/'
    })
  }

  /*----------  export functions  ----------*/
  return {
    addHub: addHub,
    getHubs: getHubs,
    getProfile: getProfile,
    getCurrentRideByUserId: getCurrentRideByUserId
  }

})
/*=====  End of USER FACTORIES  ======*/

/*====================================
=            RIDE FACTORY            =
====================================*/
.factory('Ride', function($http, Hubs) {

  /*----------  get available products by lat and lon: GET to /api/uber/products/:lat/:lon  ----------*/
  var getProducts = function(id) {
    return Hubs.getHubById(id).then(function(response){
      return $http({
        method:'GET',
        url: '/api/uber/products/' + response.data.lat + '/' + response.data.lon
      }).then(function(response) {
        return response;
      }).catch(function(err) {
        return err;
      });
    });
  };

  /*----------  get specific product info by product_id: GET to /api/ubser/product/:product_id  ----------*/
  var getProductInfo = function(id) {
    return $http({
      method:'GET',
      url: '/api/uber/product/' + id
    }).then(function(result) {
      return result;
    }).catch(function(err) {
      return err;
    });
  };

  /*----------  get estimate for a specic hub: GET to /api/uber/estimate/:product_id/:hub_id  ----------*/
  var getEstimate = function(product_id, hub_id) {
    return $http({
      method:'GET',
      url: '/api/uber/estimate/' + product_id + '/' + hub_id
    }).then(function(result) {
      return result;
    }).catch(function(err) {
      return err;
    });
  };

  /*----------  request ride from uber: POST to /api/uber/request ----------*/
  var requestRide = function(product_id, hub) {
    var coordinates = hub.geoRoute.split(', ');
    return $http({
      method:'POST',
      url: '/api/uber/request',
      data: {
        product_id: product_id,
        coordinates: coordinates,
        hub_id: hub.id
      }
    }).then(function(result) {
      if(result.data.status === 'accepted') {
        return $http({
          method: 'POST',
          url:'/api/uber/rides',
          data: {
            driver: result.data.driver,
            eta: result.data.eta,
            hub_id: result.data.hub_id,
            vehicle: result.data.vehicle,
            status: result.data.status,
            surge_multiplier: result.data.surge_multiplier,
            product_id: result.data.product_id,
            request_id: result.data.request_id,
            location: result.data.location
          }
        }).then(function(result){
          return result;
        })
      } else {
        return result;
      }
    }).catch(function(err) {
      return err;
    });
  };

  var getRideByRequestId = function(request_id) {
    return $http({
      method: 'GET',
      url: '/api/uber/rides/' + request_id
    }).then(function(result) {
      return result;
    }).catch(function(error) {
      return error;
    })
  }

  /*----------  export functions  ----------*/
  return {
    requestRide: requestRide,
    getProductInfo: getProductInfo,
    getRideByRequestId: getRideByRequestId,
    getEstimate: getEstimate,
    getProducts: getProducts
  }
})

/*=====  End of RIDE FACTORY  ======*/

/*=====================================
=            CRIME FACTORY            =
=====================================*/
.factory('Crime', function($http, Geocoder) {

  /*----------  get crime reports for a specfic location  ----------*/
  var getCrime = function(lat, lon) {
    return $http({
      method:'GET',
      url: '/api/crime/' + lat +'/' + lon
    }).then(function(result) {
      return result;
    }).catch(function(err) {
      return err;
    });
  };

  /*----------  export functions  ----------*/
  return {
    getCrime: getCrime
  }
  
})


/*=====  End of CRIME FACTORY  ======*/
/*=======================================
=            Testing Service            =
=======================================*/

.factory('Testing', function ($http) {
  var getProcessEnvironment = function () {
    return $http({
      method:'GET',
      url: '/api/testing'
    }).then(function(result) {
      return result;
    }).catch(function(err) {
      return err;
    })
  }

  return {
    getProcessEnvironment: getProcessEnvironment
  }
})

/*=====  End of Testing Service  ======*/





