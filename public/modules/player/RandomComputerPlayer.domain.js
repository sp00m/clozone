angular.module("player")

.factory("player.RandomComputerPlayer", ["player.ComputerPlayer", "utils.getRandomValue", "$timeout", "player.THINKING_WAIT_TIME_IN_MILLIS",
function (ComputerPlayer, getRandomValue, $timeout, THINKING_WAIT_TIME_IN_MILLIS) { // eslint-disable-line indent

  "use strict";

  return class RandomComputerPlayer extends ComputerPlayer {

    constructor(color, game) {
      super(color, game);
    }

    consumeSegment() {
      const availableSegments = this.game.map.segments.filter((segment) => !segment.consumed);
      const chosenSegment = getRandomValue(availableSegments);
      $timeout(() => {
        this.game.consumeSegment(chosenSegment);
      }, THINKING_WAIT_TIME_IN_MILLIS);
    }

  };

}]);
