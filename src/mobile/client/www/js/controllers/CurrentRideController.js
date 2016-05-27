(function() {
angular.module("RideHUB")
  .controller('CurrentRideController', function ($scope, $stateParams, Hubs, User, Ride, $ionicLoading, Testing, $state, $scope, $timeout, $ionicTabsDelegate, $location, Authorization) {
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

    vm.navToStart = function () {
      $location.path('/tab/start');
    }

    vm.navToCurrentRide = function () {
      $location.path('/tab/current');
    }

    vm.getRide = function () {
      Ride.getRideByRequestId($stateParams.request_id).then(function(response) {
        console.log(response)
        vm.ride = response.data;
        vm.hide($ionicLoading);
      })
    }

    // for testing environment
    vm.getCurrentRide = function (uuid) {
      User.getCurrentRideByUserId(uuid).then(function(response) {
        if(response.status === 200) {
              console.log(response)
          vm.ride = response.data;
          Hubs.getHubById(response.data.hub_id).then(function(response) {
        
            vm.ride.hub = response.data;
            vm.hide($ionicLoading);
          })
        }
        
      })
    }

    vm.doRefresh = function() {
    	vm.show($ionicLoading);
      $timeout( function() {
        Testing.getProcessEnvironment().then(function(response) {
          vm.environment = response.data
          if(!response.data.TESTING) {
            vm.getRide();
          } else {
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
