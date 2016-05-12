(function() {
  angular.module("RideHUB")
    .controller('StartController', function($scope, $timeout, Authorization, hubSearch, $location, NgMap) {
      console.log('DashCtrl initialized')
      var vm = this;
      vm.mapStyle = [
                      {
                        stylers:[
                          {hue:'#28C948'},
                          {visibility:'simplified'},
                          {gamma:0.5},
                          {weight:0.5}
                        ]
                      },
                      {
                        elementType:'labels',
                        stylers:[
                          {visibility:'on'},
                        ]
                      },
                      {
                        featureType:'water',
                        stylers:[
                          {color:'#A1E0FD'}
                        ]
                      },
                      { 
                        "featureType": "landscape.natural",
                         "stylers": [ { "visibility": "on" }, { "color": "#28C948" }, { "gamma": 4.97 }, { "lightness": -5 }, { "saturation": 100 } ] }
                    ]
   
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
