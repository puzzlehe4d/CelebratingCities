(function() {
  angular.module("RideHUB")
    .controller('RideJoinController', function($scope, $stateParams, NgMap, $ionicLoading, Hubs, Authorization, User, Ride, Crime, $location) {
      console.log('initialized ride join controller')
      var vm = this;
      vm.rides;

      Hubs.getRidesByHubId($stateParams.hubId).then(function(response) {
        console.log(response)
        vm.rides = response.data;
      })

      vm.joinRide = function (ride_id) {
        console.log(ride_id)
        Ride.joinRide(ride_id).then(function(response) {
          $location.path('/tab/current/' + response.data.request_id)
        });
      }

    });
})();
