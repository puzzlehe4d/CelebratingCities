(function() {
  angular.module("starter")
    .controller('SearchResultsController', function($scope, Hubs, $location, Authorization) {

      // checks if user is logged in; if not, navigate to login
      Authorization.isLoggedIn().then(function(response) {
        console.log(response.data)
        if(!response.data) {
          $location.path("/login");
        } 
      });

    	$scope.hubs = Hubs.all();

    	$scope.remove = function(hub) {
    	  Hubs.remove(hub);
    	};

    	$scope.createHub = function(){
    	  $location.path("tab/createHub");
    	}

    });
})();
