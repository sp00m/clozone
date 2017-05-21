angular.module("utils")

.factory("utils.playAudio", ["$window", "$log",
function ($window, $log) { // eslint-disable-line indent

  return (path) => {
    try {
      new $window.Audio(path).play();
    } catch (error) {
      $log.debug(error);
    }
  };

}]);
