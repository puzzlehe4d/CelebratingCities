(function() {
  angular.module("RideHUB")
    .controller('StartController', function($scope, Geocoder, Authorization, hubSearch, $location) {
      console.log('DashCtrl initialized')
      var vm = this;
      
       vm.map = L.map('map').setView([37.8, -96], 4);


      L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg', {
                  attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                  subdomains: '1234'
              }).addTo(vm.map);
   
      // check if user is logged in; if not, navigate to login
      Authorization.isLoggedIn().then(function(response) {
        if(!response.data) {
          $location.path("/login");
        } 
      });



      vm.scheduleRide = false;

      vm.processing = false;

      vm.findHubs = function() {
        console.log(vm.start)
        hubSearch.setData(angular.copy(vm.search))
        .then(function() {
          $location.path("tab/start/results");
        });
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
