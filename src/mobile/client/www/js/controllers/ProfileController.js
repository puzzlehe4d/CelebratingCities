(function() {
angular.module("RideHUB")
  .controller('ProfileController', function ($scope, Hubs, Ride, User, $ionicLoading, Testing, $state, $scope, $timeout, $ionicTabsDelegate, $location, Authorization) {
  	console.log('initializing Profile Controller')
    var vm = this;

    /*====================================
    =            vm variables            =
    ====================================*/
    vm.hubs;
    vm.profile;
    vm.loading = true;
    vm.ride;
    vm.isOwner;
    vm.environment;
    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = true
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

    vm.leaveRide = function () {
      if(vm.ride) {
        Ride.leaveCurrentRide(vm.ride.id).then(function(response) {
          if(response.status === 201) {
            vm.ride = undefined;
            vm.doRefresh();
          }
        })
      }
    }

    vm.cancelRide = function () {
      if(vm.ride && vm.profile) {
        console.log('TODO: cancel ride and remove all user from ride')
        // Ride.cancelCurrentRide(vm.ride.id, vm.profile.id).then(function(response) {
        //   if(response.status === 201) {
        //     vm.leaveRide();
        //   }
        // })
      }
    }

    vm.navToStart = function () {
      $location.path('/tab/start');
    }

    vm.navToRide = function () {
      $location.path('/tab/profile/current/' + vm.ride.request_id);
    }

    vm.getCurrentRide = function (uuid) {
      User.getCurrentRideByUserId(uuid).then(function(response) {
        if(response.status === 200) {
          vm.ride = response.data;
          if(vm.ride.owner === vm.profile.uuid) {
            vm.isOwner = true;
          }
          Hubs.getHubById(response.data.hub_id).then(function(response) {
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
  		    User.getProfile().then(function(response) {
  		    	vm.profile = response.data;
  		    	vm.getHubs(response.data.uuid);
            vm.getCurrentRide(response.data.uuid);
  		    });
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
