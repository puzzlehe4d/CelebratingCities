(function() {
  angular.module("starter")
    .controller('DashCtrl', function($scope, Geocoder, hubSearch, $location) {
      var vm = this;

        vm.search = {
          startAt: "",
          arriveAt: "",
          latestTime: "",
          earliestTime: "",
          timingType: "",
          travelDate: "",
          recurring: ""
        };

        vm.processing = false;

        vm.search = function() {
          hubSearch.setData(vm.search)
          .then(function() {
            $location.path("tab/chats");
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
                      vm[end + "At"] = String(address);
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
