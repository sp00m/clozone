angular.module("clozone", ["game"])

.run(["$rootScope",
function ($rootScope) { // eslint-disable-line indent

  "use strict";

  $rootScope.version = "@version";

}]);
