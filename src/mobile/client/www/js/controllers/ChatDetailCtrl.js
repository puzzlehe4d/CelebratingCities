(function() {
  angular.module("starter")
    .controller('ChatDetailCtrl', function($scope, $stateParams, Chats, Authorization) {
    	// check if user is logged in; if not, navigate to login
    	Authorization.isLoggedIn().then(function(response) {
    	  if(!response.data) {
    	    $location.path("tab/login");
    	  } 
    	});
    	
      $scope.chat = Chats.get($stateParams.chatId);
    });
})();
