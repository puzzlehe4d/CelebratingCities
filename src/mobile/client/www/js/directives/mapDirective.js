angular.module('app').directive('mapbox', [
  function () {
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        callback: "="
      },
      template: '<div></div>',
      link: function (scope, element, attributes) {
        L.mapbox.accessToken = 'pk.eyJ1IjoiZGF2b29kaGFydW4iLCJhIjoiY2lqZzc0ODVtMDExaHQ4bHRzNWFrOTRoMCJ9.jHIx_fvpw-JCCjcyoMxBpg';
        var map = L.mapbox.map(element[0], 'mapbox://styles/davoodharun/cio3q3yqh004caenf1b8j8bf0');
        scope.callback(map);
      }
    };
  }
]);