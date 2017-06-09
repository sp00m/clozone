angular.module("player")

.factory("player.SimpleComputerPlayer", ["player.ComputerPlayer", "utils.getRandomValue",
function (ComputerPlayer, getRandomValue) { // eslint-disable-line indent

  "use strict";

  return class SimpleComputerPlayer extends ComputerPlayer {

    constructor(color, game) {
      super(color, game);
    }

    consumeSegment() {
      const oneSegmentLeftZones = this.game.map.availableZones.filter((zone) => 1 === zone.availableSegments.length);
      const chosenSegment = (0 < oneSegmentLeftZones.length)
        ? oneSegmentLeftZones[0].availableSegments[0]
        : getRandomValue(this.game.map.availableSegments);
      this.game.consumeSegment(chosenSegment);
    }

  };

}]);
