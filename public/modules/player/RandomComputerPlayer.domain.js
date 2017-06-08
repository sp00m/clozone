angular.module("player")

.factory("player.RandomComputerPlayer", ["player.ComputerPlayer", "utils.getRandomValue",
function (ComputerPlayer, getRandomValue) { // eslint-disable-line indent

  "use strict";

  return class RandomComputerPlayer extends ComputerPlayer {

    constructor(color, game) {
      super(color, game);
    }

    consumeSegment() {
      const availableSegments = this.game.map.segments.filter((segment) => !segment.consumed);
      const chosenSegment = getRandomValue(availableSegments);
      this.game.consumeSegment(chosenSegment);
    }

  };

}]);
