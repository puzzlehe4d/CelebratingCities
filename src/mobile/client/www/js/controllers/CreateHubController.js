(function() {
angular.module("starter")
  .controller('CreateHubController', function ($scope, Geocoder, hubSearch, $location, Authorization, Hubs) {
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
      var hub = {
        address: vm.startAt,
        endPoint: vm.arriveAt
      }
      Hubs.createHub(hub).then(function(response) {
        console.log(response);
      }).catch(function(error){
        console.log('error adding hub', error);
      })
    }

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
