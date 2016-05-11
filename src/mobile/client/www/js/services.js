angular.module('starter.services', [])

.factory('Hubs', function($http) {
  var getAllHubs = function() {
    return $http({
      method: 'GET',
      url: '/api/hubs'
    }).then(function(result){
      return result;
    }).catch(function(err){
      return err;
    })
  }

  return {
    getAllHubs: getAllHubs
  }
})

.factory('Geocoder', function($http, $q) {
  var baseUrl = "https://maps.google.com/maps/api/geocode/json";

  return {
    getAddress: function(coords) {
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
  };
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