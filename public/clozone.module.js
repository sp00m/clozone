angular.module("clozone", ["ui.router", "home", "game"])

.run(["$rootScope", "$window",
function ($rootScope, $window) { // eslint-disable-line indent

  "use strict";

  $rootScope.version = $window.clozone.version;

}]);
