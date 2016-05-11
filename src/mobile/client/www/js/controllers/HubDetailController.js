(function() {
  angular.module("starter")
    .controller('HubDetailController', function($scope, $stateParams, Hubs, Authorization, $location) {
    	// check if user is logged in; if not, navigate to login
    	Authorization.isLoggedIn().then(function(response) {
    	  if(!response.data) {
    	    $location.path("/login");
    	  } 
    	});
    	
      $scope.hub = Hubs.get($stateParams.hubId);
    });
})();
