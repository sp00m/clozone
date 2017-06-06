angular.module("utils")

.factory("utils.playAudio", ["$window", "$log",
function ($window, $log) { // eslint-disable-line indent

  "use strict";

  const audiosByPath = new Map();

  return (path) => {
    try {
      if (!audiosByPath.has(path)) {
        audiosByPath.set(path, new $window.Audio(path));
      }
      const audio = audiosByPath.get(path);
      audio.currentTime = 0;
      audio.play();
    } catch (error) {
      $log.debug(error);
    }
  };

}]);
