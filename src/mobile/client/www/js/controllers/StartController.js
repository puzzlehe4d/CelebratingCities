(function() {
  angular.module("RideHUB")
    .controller('StartController', function($scope, $timeout, Authorization, hubSearch, $location, NgMap) {
      console.log('DashCtrl initialized')
      var vm = this;
        // NgMap.getMap().then(function(map) {
        //     vm.map = map;
        //   });

        // vm.stores = {
        //   foo: { position:[41, -87], items: [1,2,3,4]},
        //   bar:{ position:[41, -83], items: [5,6,7,8]}
        // };

        // vm.googleMapsUrl = 'https://maps.google.com/maps/api/js';
        // vm.pauseLoading=true;
        // console.log("Starting a timer to wait for 2 seconds before the map will start loading");

        // $timeout(function() {
        //   console.debug("Showing the map. The google maps api should load now.");
        //   vm.pauseLoading=false;
        // }, 2000);

        // vm.showStore = function(evt, id) {
        //   vm.store = vm.stores[id];
        //   vm.map.showInfoWindow('foo', this);
        // };
   
      // check if user is logged in; if not, navigate to login
      Authorization.isLoggedIn().then(function(response) {
        if(!response.data) {
          $location.path("/login");
        } 
      });



      vm.scheduleRide = false;

      vm.processing = false;

      vm.findHubs = function() {
          console.log('in controller')
          $location.path("tab/start/results");
  
      };

      vm.geolocate = function (end) {
        if (navigator && navigator.geolocation && navigator.geolocation.getCurrentPosition) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var latLong = [position.coords.latitude, position.coords.longitude].map(function (coord) {
                    return Number(coord).toFixed(5);
                }).toString().replace(",", ", ");
                $scope.$apply(function () {
                  vm[end + "At"] = String(latLong);
                });
                Geocoder.getAddress([position.coords.latitude, position.coords.longitude])
                    .then(function (address) {
                      vm.search[end + "At"] = String(address);
                    },
                    function () {
                      console.warn("Could not find address for location");
                    });
            },
            function (error) { console.error(error); },
            {
                timeout: 15000,
                enableHighAccuracy: true,
                maximumAge: 10000
            });
        }
      };
    });
})();
