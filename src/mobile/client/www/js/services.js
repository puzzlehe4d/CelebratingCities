angular.module('RideHUB.services', [])

.factory('Hubs', function ($http, Geocoder) {
  var getAllHubs = function () {
    return $http({
      method: 'GET',
      url: '/api/hubs'
    }).then(function(result){
      return result;
    }).catch(function(err){
      return err;
    });
  }

  var createHub = function (hub) {
    return $http({
      method: 'POST',
      url: '/api/hubs',
      data: {
        address: hub.address,
        endPoint: hub.endPoint,
        lat: hub.lat,
        lon: hub.lon
      }
    }).then(function(result){
      return result;
    }).catch(function(err){
      return err;
    });
  }

  var getHubById = function(hubId) {
    return $http({
      method: 'GET',
      url: '/api/hubs/' + hubId 
    }).then(function (result) {
      return result;
    }).catch(function (err) {
      return err
    })
  }

  var getHubsByGeoCode = function(location) {
    return $http({
      method: 'GET',
      url: '/api/hubs/' + location.coords.latitude + '/' + location.coords.longitude
    }).then(function(response) {
      return response;
    }).catch(function(err) {
      return err;
    })
  } 



  return {
    getAllHubs: getAllHubs,
    createHub: createHub,
    getHubById: getHubById,
    getHubsByGeoCode: getHubsByGeoCode
  }
})

.factory('Geocoder', function($http, $q) {

  var getGeoCode = function(address) {
    var address = address.split(' ').join('+');
    console.log(address)
    return $http({
      method: 'GET',
      url: baseUrl + '?address=' + address +"&key=AIzaSyCkSG2lTumeJ0awN_qxDoTj2Jenl2u3fUY"
    }).then(function(result) {
      return result;
    }).catch(function(err) {
      return err;
    })
  }

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

  return {
    getGeoCode: getGeoCode,
    getAddress: getAddress
  }
})

.factory('Authorization', function($http) {
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

  return {
    isLoggedIn: isLoggedIn
  }
})

.factory('User', function($http) {
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

  return {
    addHub: addHub,
    getHubs: getHubs,
    getProfile: getProfile
  }
})

.factory('Ride', function($http, Hubs) {
  var getProducts = function(id) {
    return Hubs.getHubById(id).then(function(response){
      return $http({
        method:'GET',
        url: '/api/uber/products/' + response.data.lat + '/' + response.data.lon
      }).then(function(response) {
        return response;
      }).catch(function(err) {
        return err;
      })
    })
  }

  // not used
  var getProductInfo = function(id) {
    return $http({
      method:'GET',
      url: '/api/uber/product/' + id
    }).then(function(result) {
      return result;
    }).catch(function(err) {
      return err;
    })
  }

  var getEstimate = function(product_id, hub_id) {
    return $http({
      method:'GET',
      url: '/api/uber/estimate/' + product_id + '/' + hub_id
    }).then(function(result) {
      return result;
    }).catch(function(err) {
      return err;
    })
  }

  var requestRide = function(product_id, hub) {
    var coordinates = hub.geoRoute.split(', ');
    return $http({
      method:'POST',
      url: '/api/uber/request/',
      data: {
        product_id: product_id,
        coordinates: coordinates
      }
    }).then(function(result) {
      return result;
    }).catch(function(err) {
      return err;
    })
  }

  return {
    requestRide: requestRide,
    getProductInfo: getProductInfo,
    getEstimate: getEstimate,
    getProducts: getProducts
  }
})
