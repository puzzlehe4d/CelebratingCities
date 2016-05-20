(function() {
angular.module("RideHUB")
  .controller('ProfileController', function ($scope, Hubs, User, $ionicLoading, $state, $scope, $timeout, $ionicTabsDelegate, $location, Authorization) {
  	console.log('initializing Profile Controller')
  	
    var vm = this;
    vm.hubs;
    vm.profile;
    vm.loading = true;

    vm.doRefresh = function() {
    	vm.show($ionicLoading);
      $timeout( function() {
        User.getProfile().then(function(response) {

        	vm.profile = response.data;
        	User.getHubs(response.data.uuid).then(function(response){
    	    	vm.hubs = response.data.hubs;
    	    	vm.hide($ionicLoading);
    	    	vm.loading = false;
        	});
        });

        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');

      }, 1000);

    };

    vm.show = function() {
      $ionicLoading.show({
        template: 'Gathering your favorites... <br><br><ion-spinner icon="ripple"></ion-spinner>'
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

  	


		$scope.$on("$ionicView.beforeEnter", function(event, data){
		   vm.doRefresh();
		});

	   


    
    
})
    
})();
