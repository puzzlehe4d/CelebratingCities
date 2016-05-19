(function() {
  angular.module("RideHUB")
    .controller('SearchResultsController', function($scope, Hubs, $ionicLoading, $stateParams, Geocoder, $location, Authorization) {
      var vm = this;
      vm.address = $stateParams.address.split('_').join(' ');
      vm.hubs = [];

      vm.show = function() {
        $ionicLoading.show({
          template: '<ion-spinner icon="ripple"></ion-spinner>'
        });
      };

      vm.hide = function(){
        $ionicLoading.hide();
      };
      // checks if user is logged in; if not, navigate to login
      Authorization.isLoggedIn().then(function(response) {
        console.log(response.data)
        if(!response.data) {
          $location.path("/login");
        } 
      });
      
      Geocoder.getGeoCode($stateParams.address).then(function(response) {
        vm.show($ionicLoading);
        if(response.data.results.length > 0) {
          var position = {
            coords: {
              latitude: response.data.results[0].geometry.location.lat,
              longitude: response.data.results[0].geometry.location.lng
            }
          }
          vm.hide($ionicLoading);
          Hubs.getHubsByGeoCode(position).then(function(response){
            response.data.forEach(function(element) {
              vm.hubs.push(element);
              
            });  
          })
        } else {
          vm.hide($ionicLoading);
        }
        
      });
    	// Hubs.getHubsBy().then(function(response){
     //    vm.hubs = response.data;
     //  }).catch(function(err) {
     //    console.log('error getting hubs', err);
     //  });

    	vm.remove = function(hub) {
    	  Hubs.remove(hub);
    	};

    	vm.createHub = function(){
    	  $location.path("tab/createHub");
    	}

    });
})();
