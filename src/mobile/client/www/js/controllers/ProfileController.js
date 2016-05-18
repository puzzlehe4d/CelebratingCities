(function() {
angular.module("RideHUB")
  .controller('ProfileController', function ($scope, Hubs, User, $state, $scope, $timeout, $ionicTabsDelegate, $location, Authorization) {
  	console.log('initializing Profile Controller')
  	
    var vm = this;
    vm.hubs;
    vm.profile;

    // check if user is logged in; if not, navigate to login
    Authorization.isLoggedIn().then(function(response) {
      if(!response.data) {
        $location.path("/login");
      } 
    });

    vm.doRefresh = function() {
	    console.log('Refreshing!');
      User.getProfile().then(function(response) {
      	vm.profile = response.data;
      	User.getHubs(response.data.uuid).then(function(response){
  	    	console.log(response.data)
  	    	vm.hubs = response.data.hubs;
      	})
      })

  	};

		$scope.$on("$ionicView.beforeEnter", function(event, data){
		   vm.doRefresh();
		});

	   


    
    
})
    
})();
