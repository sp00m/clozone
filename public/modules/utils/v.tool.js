angular.module("utils")

.factory("utils.v", ["$window",
function ($window) { // eslint-disable-line indent

  "use strict";

  return $window.clozone.v;

}]);
