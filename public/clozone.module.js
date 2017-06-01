angular.module("clozone", ["game"])

.run(["$rootScope",
function ($rootScope) { // eslint-disable-line indent

  $rootScope.version = "@version";

}]);
