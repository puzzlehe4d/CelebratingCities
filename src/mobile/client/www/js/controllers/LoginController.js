(function() {
  angular.module("RideHUB")
    .controller('LoginController', function($scope, $stateParams, Testing, $location, Authorization, $ionicPopup) {
    	var vm = this;
    	vm.environment;
    	$scope.data = {};
   		Testing.getProcessEnvironment().then(function(response) {
   			vm.environment = response.data;
   		})

   		vm.fakeLogin = function () {
   			var myPopup = $ionicPopup.show({
 			    template: '<input ng-model="data.id">',
 			    title: 'You have started server in TESTING MODE -- your default location will be somewhere in Baltimore, MD. Please enter unique id for testing environment',
 			    subTitle: 'if testing multiple users, be sure to use a different id for each login',
 			    scope: $scope,
 			    buttons: [
 			      { text: 'Cancel' },
 			      {
 			        text: '<b>LOGIN</b>',
 			        type: 'button-balanced',
 			        onTap: function(e) {
 			          if (!$scope.data.id) {
 			            //don't allow the user to close unless he enters wifi password
 			            e.preventDefault();
 			          } else {
 			            Authorization.authorizeFakeUser($scope.data.id).then(function(response) {
 			            	$location.path(response.data.redirect);
 			            })
 			          }
 			        }
 			      }
 			    ]
 			  });
 
   		}
    });
})();
