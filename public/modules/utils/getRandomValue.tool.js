angular.module("utils")

.factory("utils.getRandomValue", [
function () { // eslint-disable-line indent

  "use strict";

  return (a) => a[Math.floor(Math.random() * a.length)];

}]);
