(function() {
  angular.module("starter")
    .controller('ChatsCtrl', function($scope, Chats, $location, Authorization) {

      // checks if user is logged in; if not, navigate to login
      Authorization.isLoggedIn().then(function(response) {
        if(!response.data) {
          $location.path("tab/login");
        } 
      });

    	$scope.chats = Chats.all();

    	$scope.remove = function(chat) {
    	  Chats.remove(chat);
    	};

    	$scope.createHub = function(){
    	  $location.path("tab/account");
    	}

    });
})();
