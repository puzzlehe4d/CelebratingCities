(function() {
  angular.module("RideHUB")
    .controller('SearchResultsController', function($scope, Hubs, $location, Authorization) {
      var vm = this;
      vm.hubs;
      // checks if user is logged in; if not, navigate to login
      Authorization.isLoggedIn().then(function(response) {
        console.log(response.data)
        if(!response.data) {
          $location.path("/login");
        } 
      });

    	Hubs.getAllHubs().then(function(response){
        vm.hubs = response.data;
      }).catch(function(err) {
        console.log('error getting hubs', err);
      });

    	vm.remove = function(hub) {
    	  Hubs.remove(hub);
    	};

    	vm.createHub = function(){
    	  $location.path("tab/createHub");
    	}

    });
})();
