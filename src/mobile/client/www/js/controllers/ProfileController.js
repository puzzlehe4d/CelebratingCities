(function() {
angular.module("RideHUB")
  .controller('ProfileController', function ($scope, Hubs, User, $ionicLoading, $state, $scope, $timeout, $ionicTabsDelegate, $location, Authorization) {
  	console.log('initializing Profile Controller')
  	
    var vm = this;
    vm.hubs;
    vm.profile;
    vm.loading = true;
    vm.show = function() {
      $ionicLoading.show({
        template: '<ion-spinner icon="ripple"></ion-spinner>'
      });
    };

    vm.hide = function(){
      $ionicLoading.hide();
    };
    // check if user is logged in; if not, navigate to login
    Authorization.isLoggedIn().then(function(response) {
      if(!response.data) {
        $location.path("/login");
      } 
    });

  	vm.show($ionicLoading);
    User.getProfile().then(function(response) {

    	vm.profile = response.data;
    	User.getHubs(response.data.uuid).then(function(response){
	    	console.log(response.data)
	    	vm.hubs = response.data.hubs;
	    	vm.hide($ionicLoading);
	    	vm.loading = false;
    	})
    })


		// $scope.$on("$ionicView.beforeEnter", function(event, data){
		//    vm.doRefresh();
		// });

	   


    
    
})
    
})();
