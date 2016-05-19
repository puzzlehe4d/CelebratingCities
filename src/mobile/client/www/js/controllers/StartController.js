(function() {
  angular.module("RideHUB")
    .controller('StartController', function($scope, Geocoder, Ride, Hubs, $timeout, $ionicLoading, Authorization, hubSearch, $ionicPopup, $location, NgMap) {
      
      console.log('DashCtrl initialized')
      var vm = this;
      vm.lat;
      vm.crimes = [];
      vm.lon;
      vm.loading = true;
      vm.positions = [];
      vm.mapStyle = [{"featureType":"water","elementType":"all","stylers":[{"hue":"#7fc8ed"},{"saturation":55},{"lightness":-6},{"visibility":"on"}]},{"featureType":"water","elementType":"labels","stylers":[{"hue":"#7fc8ed"},{"saturation":55},{"lightness":-6},{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"hue":"#83cead"},{"saturation":1},{"lightness":-15},{"visibility":"on"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"hue":"#f3f4f4"},{"saturation":-84},{"lightness":59},{"visibility":"on"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"on"}]},{"featureType":"road","elementType":"labels","stylers":[{"hue":"#bbbbbb"},{"saturation":-100},{"lightness":26},{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"hue":"#ffcc00"},{"saturation":100},{"lightness":-35},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"hue":"#ffcc00"},{"saturation":100},{"lightness":-22},{"visibility":"on"}]},{"featureType":"poi.school","elementType":"all","stylers":[{"hue":"#d7e4e4"},{"saturation":-60},{"lightness":23},{"visibility":"on"}]}]
      vm.hubs = [];
      // check if user is logged in; if not, navigate to login
      

      vm.show = function() {
        $ionicLoading.show({
          template: 'Finding hubs closest to your location...<br><br><ion-spinner icon="lines"> </ion-spinner>'
        });
      };

      vm.hide = function(){
        $ionicLoading.hide();
      };
      
      Authorization.isLoggedIn().then(function(response) {
        if(!response.data) {
          $location.path("/login");
        } 
      });
      if (navigator && navigator.geolocation && navigator.geolocation.getCurrentPosition) {
        vm.show($ionicLoading);
        navigator.geolocation.getCurrentPosition(function(position) {
          vm.location = position.coords.latitude + ',' + position.coords.longitude;
          Hubs.getHubsByGeoCode(position).then(function(response) {
            response.data.forEach(function(element) {
              var point = {lat: element.lat, lng: element.lon, name: element.name, address: element.address};
              vm.positions.push(point); 
            })  
          }).then(function(){
              NgMap.getMap().then(function(map) {
                map.setCenter();
                Ride.getCrime().then(function(response) {
                  vm.crimes = response.data;
                  console.log(response)
                  vm.hide($ionicLoading)
                })
              });
              vm.hide($ionicLoading);
              vm.loading = false;
            })
          
        },
        function (error) { console.error(error); },
        {
            enableHighAccuracy: true,
            maximumAge: 10000
        });
      }

      



      vm.scheduleRide = false;

      vm.processing = false;

      vm.findHubs = function() {
        
        if(vm.startAt) {
          var query = vm.startAt.split(' ').join('_')
          $location.path("tab/start/results/address/" + query);
        } else {
          var myPopup = $ionicPopup.show({
              title: 'Please choose a starting location',
              scope: $scope,
              buttons: [
                { text: 'OK',
                  type: 'button-balanced'
                },
              ]
            });
        }
          
      }

      vm.geolocate = function (position) {
        Geocoder.getAddress().then(function(location) {
          console.log(location)
          if(position === 'start') {
            vm.startAt = location;
          } else {
            vm.arriveAt = location;
          }  
        }).catch(function(err) {
          console.log(err)
        })
      };
    });
})();
