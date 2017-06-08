angular.module("player")

.factory("player.ComputerPlayer", ["player.Player", "utils.getRandomValue", "$timeout",
function (Player, getRandomValue, $timeout) { // eslint-disable-line indent

  "use strict";

  const thinkingTimeInMillis = 1000;

  const consumeSegment = function () {
    const availableSegments = this.game.map.segments.filter((segment) => !segment.consumed);
    const chosenSegment = getRandomValue(availableSegments);
    $timeout(() => {
      this.game.consumeSegment(chosenSegment);
    }, thinkingTimeInMillis);
  };

  return class ComputerPlayer extends Player {

    constructor(color, game) {
      super(color);
      this.human = false;
      this.game = game;
    }

    play() {
      consumeSegment.call(this);
    }

  };

}]);
