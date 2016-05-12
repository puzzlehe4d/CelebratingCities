(function() {
angular.module("RideHUB")
  .controller('ProfileController', function ($scope, Geocoder, hubSearch, $location, Authorization) {
    var vm = this;

    // check if user is logged in; if not, navigate to login
    Authorization.isLoggedIn().then(function(response) {
      if(!response.data) {
        $location.path("/login");
      } 
    });
  })
    
})();
