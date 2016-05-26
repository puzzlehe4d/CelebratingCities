(function() {
  angular.module("RideHUB")
  .controller('HubRequestController', function($scope, $stateParams, Hubs, Authorization, $ionicPopup, $location, User, Ride, $location) {
    console.log('initialized Hub Detail Controller')
    var vm = this;

    /*====================================
    =            vm variables            =
    ====================================*/
    vm.hub;
    vm.products;
    vm.detail;
    vm.estimate;
    vm.req_category;
    /*=====  End of vm variables  ======*/

    /*====================================
    =            vm functions            =
    ====================================*/
    vm.Authorization = function () {
      Authorization.isLoggedIn().then(function(response) {
        if(!response.data) {
          $location.path("/tab/login");
        } 
      });
    }

    vm.getProductInfo = function(id) {
      vm.detail = vm.estimate[vm.estimate.map(function(element){
        return element.product_id;
      }).indexOf(id)];
    }

    vm.requestRide = function(product_id) {
      Ride.requestRide(product_id, vm.hub).then(function(response) {
        if(response.status === 500) {
          var myPopup = $ionicPopup.show({
            title: 'request failed!',
            scope: $scope,
            buttons: [
              { text: 'OK',
                type: 'button-balanced'
              },
            ]
          });
        } 
        else if(response.status === 200 && response.data.status) {
          var myPopup = $ionicPopup.show({
            title: 'You are already part of a ride that is in progress!',
            scope: $scope,
            buttons: [
              { text: 'OK',
                type: 'button-balanced'
              },
            ]
          }); 
        } 
        else if (response.status === 201) {
          var myPopup = $ionicPopup.show({
            title: 'success!',
            scope: $scope,
            buttons: [
              { text: 'OK',
                type: 'button-balanced'
              },
            ]
          });
          $location.path('/tab/profile');

        }
      }).catch(function(error) {
        console.log('error making request', error);
      })
    }

    vm.getHubById = function() {
      Hubs.getHubById($stateParams.hubId).then(function(response) {
        vm.hub = response.data;
      }).catch(function(err) {
        console.log('error getting hub information', err);
      });
    }

    vm.getProducts = function () {
      Ride.getProducts($stateParams.hubId).then(function(response) {
        vm.products = response.data.products;
        var index = response.data.products[response.data.products.map(function(element){
          return element.display_name;
        }).indexOf('uberX')];

        if(vm.products){
          vm.req_category = vm.products[0].product_id;
        }

        Ride.getEstimate(vm.req_category, vm.hub.id).then(function(response) {
          vm.estimate = response.data.prices;
          var index = response.data.prices[response.data.prices.map(function(element){
            return element.display_name;
          }).indexOf('uberX')];
          
          if(index >= 0) {
            vm.detail = response.data.prices[index];
          } else {
            vm.detail = response.data.prices[0];
          }
        }).catch(function(error) {
          console.log('error getting estimate', error);
        })

      }).catch(function(err) {
        console.log('error getting product information', err);
      });
    }
    /*=====  End of vm functions  ======*/
    
    
    /*======================================
    =            Init function calls            =
    ======================================*/
    vm.Authorization();
    vm.getHubById();
    vm.getProducts();
    /*=====  End of Init function calls  ======*/
  });
})();
