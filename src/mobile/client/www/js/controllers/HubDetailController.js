(function() {
  angular.module("RideHUB")
    .controller('HubDetailController', function($scope, $stateParams, NgMap, $ionicLoading, Hubs, Authorization, User, Ride, Crime, $location) {
        console.log('initialized Hub Detail Controller')
    	var vm = this;
      vm.crimes = [];
      vm.hub;
      vm.mapStyle = [{"featureType":"water","elementType":"all","stylers":[{"hue":"#7fc8ed"},{"saturation":55},{"lightness":-6},{"visibility":"on"}]},{"featureType":"water","elementType":"labels","stylers":[{"hue":"#7fc8ed"},{"saturation":55},{"lightness":-6},{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"hue":"#83cead"},{"saturation":1},{"lightness":-15},{"visibility":"on"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"hue":"#f3f4f4"},{"saturation":-84},{"lightness":59},{"visibility":"on"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"on"}]},{"featureType":"road","elementType":"labels","stylers":[{"hue":"#bbbbbb"},{"saturation":-100},{"lightness":26},{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"hue":"#ffcc00"},{"saturation":100},{"lightness":-35},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"hue":"#ffcc00"},{"saturation":100},{"lightness":-22},{"visibility":"on"}]},{"featureType":"poi.school","elementType":"all","stylers":[{"hue":"#d7e4e4"},{"saturation":-60},{"lightness":23},{"visibility":"on"}]}]

      vm.show = function() {
        $ionicLoading.show({
          template: '<ion-spinner icon="ripple"></ion-spinner>'
        });
      };

      vm.hide = function(){
        $ionicLoading.hide();
      };

      vm.show($ionicLoading)
      Authorization.isLoggedIn().then(function(response) {
    	  if(!response.data) {
    	    $location.path("/login");
    	  } 
    	});


      
      Hubs.getHubById($stateParams.hubId).then(function(response){
        
        vm.hub = response.data;
        Crime.getCrime(vm.hub.lat, vm.hub.lon).then(function(response) {
        vm.crimes = response.data;
        NgMap.getMap().then(function(map) {
          map.setCenter();
          vm.hide($ionicLoading)
        });
        
      });
        
      }).catch(function(error) {
        console.log('error getting hub', error);
      })


      

      vm.joinHub = function(){
        User.addHub($stateParams.hubId).then(function(response){
          $location.path('/tab/profile');
        }).catch(function(error) {
          console.log('error adding hub', error)
        })
      }

      vm.navToRequest = function(){
        if(vm.hub){ 
          $location.path('/tab/start/request/' + vm.hub.id);
        }
      }

      vm.navToJoinRide = function(){
        if(vm.hub){ 
          $location.path('/tab/joinRide/' + vm.hub.id);
        }
      }

    });
})();
