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
      if(vm.startAt && vm.arriveAt) {
        Geocoder.getGeoCode(vm.startAt).then(function(response) {
          var geoRouteStart = response.data.results[0].geometry.location.lat + ', ' + response.data.results[0].geometry.location.lng;
          var area = response.data.results[0].address_components[2] || 'N/A';

          var recurring = vm.recurring ? '' + vm.monday + ', ' + vm.tuesday + ', ' + vm.wednesday + ', ' + vm.thursday + ', ' + vm.friday + ', ' + vm.saturday + ', ' + vm.sunday : null
          vm.hub = {
            address: vm.startAt,
            leaveTime: vm.leaveTime,
            endPoint: vm.arriveAt,
            recurring: recurring,
            area: area,
            lat: response.data.results[0].geometry.location.lat,
            lon: response.data.results[0].geometry.location.lng,
            geoRoute: geoRouteStart,
          }

          Geocoder.getGeoCode(vm.arriveAt).then(function(response) {
            var geoRouteEnd = response.data.results[0].geometry.location.lat + ', ' + response.data.results[0].geometry.location.lng;
            var geoRoute = vm.hub.geoRoute.concat(', ', geoRouteEnd)
            vm.hub.geoRoute = geoRoute;
            Hubs.createHub(vm.hub).then(function(response) {
              vm.startAt = '';
              vm.arriveAt = '';
              vm.leaveTime= '';
              vm.monday = undefined;
              vm.tuesday = undefined;
              vm.wednesday = undefined;
              vm.thursday = undefined;
              vm.friday = undefined;
              vm.saturday = undefined;
              vm.sunday = undefined;

              var myPopup = $ionicPopup.show({
                title: 'successfully added hub!',
                scope: $scope,
                buttons: [
                  { text: 'OK',
                    type: 'button-balanced'
                  },
                ]
              });

              $location.path("/tab/start/results/" + response.data.id);
            }).catch(function(error){
              console.log('error adding hub', error);
            })
          }).catch(function(error) {
            console.log(error)
          });
        });
      } else {
        var myPopup = $ionicPopup.show({
          title: 'Please enter a starting and drop off location',
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
