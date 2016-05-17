(function() {
  angular.module("RideHUB")
    .controller('HubRequestController', function($scope, $stateParams, Hubs, Authorization, User, Ride, $location) {
      console.log('initialized Hub Detail Controller')
      var vm = this;
      vm.hub;
      vm.products;
      vm.detail;
      Hubs.getHubById($stateParams.hubId).then(function(response) {
        vm.hub = response.data;
      }).catch(function(err) {
        console.log('error getting hub information', err);
      })
      Ride.requestRide($stateParams.hubId).then(function(response) {
        console.log(response)
        vm.products = response.data.products;
        var index = response.data.products[response.data.products.map(function(element){
          return element.display_name;
        }).indexOf('uberX')];

        if(index >= 0) {
          vm.detail = response.data.products[index];
        } else {
          vm.detail = response.data.products[0];
        }

      }).catch(function(err) {
        console.log('error getting product information', err);
      })

      vm.getProductInfo = function(id) {
        vm.detail = vm.products[vm.products.map(function(element){
          return element.product_id;
        }).indexOf(id)];

        // Ride.getProductInfo(id).then(function(response) {
        //   console.log(response)
        //   vm.products = response.data;
        // }).catch(function(err) {
        //   console.log('error getting product information', err);
        // })
      }

    });
})();
