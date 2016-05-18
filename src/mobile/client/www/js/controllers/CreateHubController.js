(function() {
angular.module("RideHUB")
  .controller('CreateHubController', function ($scope, hubSearch, Geocoder, $ionicPopup, $location, Authorization, Hubs) {
    console.log('initializing CreateHubController...')
    var vm = this;

    // check if user is logged in; if not, navigate to login
    Authorization.isLoggedIn().then(function(response) {
      if(!response.data) {
        $location.path("/login");
      } 
    });
    
    vm.search = hubSearch.getData();

    vm.scheduleRide = false;

    vm.processing = false;

    $scope.$watch(hubSearch.getData, function(newSearchData){
      vm.search = newSearchData;
    });

    vm.createHub = function() {
      console.log('in controller')
      if(vm.startAt) {
        Geocoder.getGeoCode(vm.startAt).then(function(response) {
          var geoRouteStart = response.data.results[0].location.lat + ', ' + response.data.results[0].location.lng;
          var hub = {
            address: vm.startAt,
            endPoint: vm.arriveAt,
            lat: response.data.results[0].geometry.location.lat,
            lon: response.data.results[0].geometry.location.lng,
            geoRoute: geoRouteStart,
          }

          Geocoder.getGeoCode(vm.arriveAt).then(function(response) {
            var geoRouteEnd = response.data.results[0].location.lat + ', ' + response.data.results[0].location.lng;
            var geoRoute = hub.geoRoute.concat(', ', geoRouteEnd)
            var hub = {
              geoRoute: geoRoute,
            }

            Hubs.createHub(hub).then(function(response) {
              console.log(response);
              vm.startAt = '';
              vm.arriveAt = '';
            }).catch(function(error){
              console.log('error adding hub', error);
            })
          }).catch(function(error) {
            console.log(error)
          });
        });
      } else {
        var myPopup = $ionicPopup.show({
            title: 'Please enter a starting location',
            scope: $scope,
            buttons: [
              { text: 'OK',
                type: 'button-balanced'
              },
            ]
          });
      }
      
    }

    vm.geolocate = function(position) {
      Geocoder.getAddress().then(function(location) {
        console.log(location)
        if(position === 'start') {
          vm.startAt = location;
        } else {
          vm.arriveAt = location;
        }
        
      }).catch(function(err) {
        console.log(err)
      })
    }
  });
})();
