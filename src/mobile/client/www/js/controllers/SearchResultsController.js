(function() {
  angular.module("starter")
    .controller('SearchResultsController', function($scope, Hubs, $location, Authorization) {
      $scope.hubs;
      // checks if user is logged in; if not, navigate to login
      Authorization.isLoggedIn().then(function(response) {
        console.log(response.data)
        if(!response.data) {
          $location.path("/login");
        } 
      });

    	Hubs.getAllHubs().then(function(response){
        $scope.hubs = response.data;
      }).catch(function(err) {
        console.log('error getting hubs', err);
      });

    	$scope.remove = function(hub) {
    	  Hubs.remove(hub);
    	};

    	$scope.createHub = function(){
    	  $location.path("tab/createHub");
    	}

    });
})();
