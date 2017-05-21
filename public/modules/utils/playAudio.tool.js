angular.module("utils")

.factory("utils.playAudio", ["$window", "$log",
function ($window, $log) { // eslint-disable-line indent

  const audiosByPath = new Map();

  return (path) => {
    try {
      if (!audiosByPath.has(path)) {
        audiosByPath.set(path, new $window.Audio(path));
      }
      audiosByPath.get(path).play();
    } catch (error) {
      $log.debug(error);
    }
  };

}]);
