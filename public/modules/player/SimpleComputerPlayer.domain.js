angular.module("player")

.factory("player.SimpleComputerPlayer", ["player.ComputerPlayer", "utils.getRandomValue",
function (ComputerPlayer, getRandomValue) { // eslint-disable-line indent

  "use strict";

  const chooseSegment = function () {
    const oneSegmentLeftZones = this.game.map.availableZones.filter((zone) => 1 === zone.availableSegments.length);
    return (0 < oneSegmentLeftZones.length)
      ? oneSegmentLeftZones[0].availableSegments[0]
      : getRandomValue(this.game.map.availableSegments);
  };

  return class SimpleComputerPlayer extends ComputerPlayer {

    constructor(color, game) {
      super(color, game);
    }

    consumeSegment() {
      const chosenSegment = chooseSegment.call(this);
      this.game.consumeSegment(chosenSegment);
    }

  };

}]);
