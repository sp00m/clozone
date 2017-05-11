angular.module("utils")

.factory("generator.getRandomValue", [
function () {
  return (a) => a[Math.floor(Math.random() * a.length)];
}]);
