angular.module('RideHUB.services', [])

.factory('Hubs', function ($http) {
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
  var baseUrl = "https://maps.google.com/maps/api/geocode/json";

  var getAddress = function(coords) {
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

  var getGeoCode = function(address) {
    var address = address.split(' ').join('+');
    console.log(address)
    return $http({
      method: 'GET',
      url: baseUrl + '?address=' + address +"&key=AIzaSyCkSG2lTumeJ0awN_qxDoTj2Jenl2u3fUY"
    }).then(function(result) {
      console.log(result)
      return result;
    }).catch(function(err) {
      return err;
    })
  }



  return {
    getAddress: getAddress,
    getGeoCode: getGeoCode
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
  var requestRide = function(id) {
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

  return {
    requestRide: requestRide,
    getProductInfo: getProductInfo
  }
})
