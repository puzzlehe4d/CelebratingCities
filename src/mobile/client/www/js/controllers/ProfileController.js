(function() {
angular.module("RideHUB")
  .controller('ProfileController', function ($scope, Hubs, User, $ionicLoading, Testing, $state, $scope, $timeout, $ionicTabsDelegate, $location, Authorization) {
  	console.log('initializing Profile Controller')
    var vm = this;

    /*====================================
    =            vm variables            =
    ====================================*/
    vm.hubs;
    vm.profile;
    vm.loading = true;
    vm.ride;
    vm.environment;
    /*=====  End of vm variables  ======*/
    
    /*====================================
    =            vm functions            =
    ====================================*/
    vm.show = function() {
      $ionicLoading.show({
        template: 'Gathering your favorites... <br><br><ion-spinner icon="ripple"></ion-spinner>'
      });
    };

    vm.hide = function(){
      $ionicLoading.hide();
    };

    vm.Authorize = function () {
    	Authorization.isLoggedIn().then(function(response) {
    	  if(!response.data) {
    	    $location.path("/login");
    	  } 
    	});
    }
    
    vm.getHubs = function(uuid){
    	User.getHubs(uuid).then(function(response){
	    	vm.hubs = response.data.hubs;
	    	vm.hide($ionicLoading);
	    	vm.loading = false;
    	});
    }

    vm.navToStart = function () {
      $location.path('/tab/start');
    }

    vm.getCurrentRide = function (uuid) {
      User.getCurrentRide(uuid).then(function(response) {
        if(response.status === 200) {
          vm.ride = response.data;
          Hubs.getHubById(response.data.hub_id).then(function(response) {
            console.log(response)
            vm.ride.hub = response.data;
          })
        }
        
      })
    }

    vm.doRefresh = function() {
    	vm.show($ionicLoading);
      $timeout( function() {
      	Testing.getProcessEnvironment().then(function(response){
      		vm.environment = response.data;
      		if(!vm.environment.TESTING) {
	  		    User.getProfile().then(function(response) {
	  		    	vm.profile = response.data;
	  		    	vm.getHubs(response.data.uuid);
              vm.getCurrentRide(response.data.uuid);
	  		    });

      		}
      		else if(vm.environment.TESTING) {
			    	vm.getHubs(vm.environment.user);
            vm.getCurrentRide(vm.environment.user);
      		} 
      	}) 
      }, 1000);
    };
    /*=====  End of vm functions  ======*/
    
    /*======================================
    =            Init functions            =
    ======================================*/
    vm.Authorize();

		$scope.$on("$ionicView.beforeEnter", function(event, data){
		   vm.doRefresh();
		});
    /*=====  End of Init functions  ======*/
	}) 
})();
