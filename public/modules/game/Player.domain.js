angular.module("game")

.factory("game.Player", [
function () { // eslint-disable-line indent

  "use strict";

  return class Player {

    constructor(color) {
      this.human = true;
      this.color = color;
      this.score = 0;
    }

    play() { // eslint-disable-line class-methods-use-this
      // noop
    }

    calculateScore(map) {
      this.score = map.zones.filter((zone) => zone.closed).reduce((score, zone) => (zone.closedBy === this)
        ? score + zone.area
        : score + zone.segments.filter((segment) => segment.consumedBy === this).length,
      0);
    }

  };

}]);
