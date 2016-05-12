(function() {
  angular.module("RideHUB")
    .controller('HubDetailController', function($scope, $stateParams, Hubs, Authorization, $location) {
    	var vm = this;
        vm.hub;
        vm.mapStyle = [
                        {
                          stylers:[
                            {hue:'#28C948'},
                            {visibility:'simplified'},
                            {gamma:0.5},
                            {weight:0.5}
                          ]
                        },
                        {
                          elementType:'labels',
                          stylers:[
                            {visibility:'on'},
                          ]
                        },
                        {
                          featureType:'water',
                          stylers:[
                            {color:'#A1E0FD'}
                          ]
                        },
                        { 
                          "featureType": "landscape.natural",
                           "stylers": [ { "visibility": "on" }, { "color": "#28C948" }, { "gamma": 4.97 }, { "lightness": -5 }, { "saturation": 100 } ] }
                      ]
        // check if user is logged in; if not, navigate to login
    	Authorization.isLoggedIn().then(function(response) {
    	  if(!response.data) {
    	    $location.path("/login");
    	  } 
    	});
      Hubs.getHubById($stateParams.hubId).then(function(response){
        console.log(response)
        vm.hub = response.data;
      }).catch(function(error) {
        console.log('error getting hub', error);
      })
    });
})();
