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

    });
})();
