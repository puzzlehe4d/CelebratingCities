(function() {
  angular.module("starter")
    .controller('MapCtrl', function($scope) {
    	document.addEventListener("DOMContentLoaded", function () {
    	          try {
    	              ////window.setTimeout(onDeviceReady, 2000);
    	          }
    	          catch (ex) { }
    	      }, false);

    	window.onMapsApiLoaded = onDeviceReady;

    	function onDeviceReady() {
    	    // Getting the map selector in DOM
    	  var div = document.getElementById("map_canvas");

    	  // Invoking Map using Google Map SDK v2 by dubcanada
    	  var map = new google.maps.Map(div, {
    	    center: {lat: 39.2991431, lng: -76.708653},
    	    scrollwheel: false,
    	    zoom: 12
    	  });

    	  // Capturing event when Map load are ready.
    	  window.setTimeout(function(){

    	      // Defining markers for demo
    	      var locations = [{
    	          position: [39.2991431,-76.708653],
    	          title: "Marker 1"
    	      }, {
    	          position: [39.3169503,-76.7059585],
    	          title: "Marker 2"
    	      }];

    	      // Bind markers
    	      for (var i = 0; i < locations.length; i++) {
    	          var marker = new google.maps.Marker({
    	            map: map,
    	            position: { lat: locations[i].position[0], lng: locations[i].position[1] },
    	            title: 'Hello World!'
    	          });
    	      }
    	  }, 0);

    	  // Function that return a LatLng Object to Map
    	  function setPosition(lat, lng) {
    	      return new google.maps.LatLng(lat, lng);
    	  }
    	}
    });
})();
