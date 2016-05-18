// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('RideHUB', ['ionic', 'RideHUB.services', 'ngMap', 'angularSpinners'])

.run(function($ionicPlatform, $ionicNavBarDelegate) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // For Simulator, ensure correct platform-specific class names
    window.setTimeout(function() {
        if (document.body.classList.contains("platform-android")) {
            _.forEach(_.filter(document.body.classList, function(className) {
                return className.indexOf("-android") !== -1;
            }), function (className) {
                document.body.classList.remove(className);
            });
            _.forEach(["platform-ios", "platform-ios9", "platform-ios9_1"], function (className) {
                document.body.classList.add(className);
            });
        }
    }, 0);
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.start', {
    url: '/start',
    views: {
      'tab-start': {
        templateUrl: 'templates/tab-start.html',
        controller: 'StartController',
        controllerAs: 'vm'
      }
    }
  })
  .state('tab.results', {
    url: '/start/results/address/:address',
    views: {
      'tab-start': {
        templateUrl: 'templates/tab-searchResults.html',
        controller: 'SearchResultsController',
        controllerAs: 'vm'
      }
    }
  })
  .state('login', {
    url: '/login',
    templateUrl: 'templates/tab-login.html',
    controller: 'LoginController',
    controllerAs: 'vm'
  })
  // .state('tab.chats', {
  //     url: '/chats',
  //     views: {
  //       'tab-chats': {
  //         templateUrl: 'templates/tab-chats.html',
  //         controller: 'ChatsCtrl'
  //       }
  //     }
  //   })
    .state('tab.hub-detail', {
      url: '/start/results/:hubId',
      views: {
        'tab-start': {
          templateUrl: 'templates/hub-detail.html',
          controller: 'HubDetailController',
          controllerAs: 'vm'
        }
      }
    })

    .state('tab.hub-request', {
      url: '/start/request/:hubId',
      views: {
        'tab-start': {
          templateUrl: 'templates/hub-request.html',
          controller: 'HubRequestController',
          controllerAs: 'vm'
        }
      }
    })

  .state('tab.profile', {
    url: '/profile',
    views: {
      'tab-profile': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'ProfileController',
        controllerAs: 'vm'
      }
    }
  })

  .state('tab.createHub', {
    url: '/createHub',
    views: {
      'tab-createHub': {
        templateUrl: 'templates/tab-createHub.html',
        controller: 'CreateHubController',
        controllerAs: 'vm'
      }
    }
  })
  // .state('tab.map', {
  //   url: '/map',
  //   views: {
  //     'tab-map': {
  //       templateUrl: 'templates/tab-map.html',
  //       controller: 'MapCtrl'
  //     }
  //   }
  // });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/start');

  // (function () {
  //     if (typeof (Connection) !== "undefined") {
  //         if (navigator.connection.type === Connection.NONE || loadPending || isGoogleMapsLoaded()) {
  //             return;
  //         }
  //     }
  //     loadScript("https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&libraries=visualization&callback=onMapsApiLoaded");
  // })();



  //       function loadScript(src) {
  //           var script = document.createElement('script');
  //           script.type = 'text/javascript';
  //           script.src = src;
  //           document.body.appendChild(script);
  //       }

  //       window.onMapsApiLoaded = function () {
  //       };

});
