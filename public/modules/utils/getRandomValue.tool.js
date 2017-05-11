angular.module("utils")

.factory("utils.getRandomValue", [
function () {
  return (a) => a[Math.floor(Math.random() * a.length)];
}]);
