(function() {
  angular.module("RideHUB")
    .controller('HubDetailController', function($scope, $stateParams, Hubs, Authorization, $location) {
    	var vm = this;
        vm.hub;
        // check if user is logged in; if not, navigate to login
    	Authorization.isLoggedIn().then(function(response) {
    	  if(!response.data) {
    	    $location.path("/login");
    	  } 
    	});
      Hubs.getHubById($stateParams.hubId).then(function(response){
        console.log(response)
        vm.hub = response.data;
      }).catch(function(error) {
        console.log('error getting hub', error);
      })
    });
})();
