(function() {
  angular.module("starter")
    .controller('ChatsCtrl', function($scope, Chats, $location) {
    	$scope.chats = Chats.all();
    	$scope.remove = function(chat) {
    	  Chats.remove(chat);
    	};
    	$scope.createHub = function(){
    	  $location.path("tab/account");
    	}
    });
})();
