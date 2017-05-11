angular.module("game")

.factory("game.Player", [
function () {

  return class Player {

    constructor(color) {
      this.color = color;
      this.score = 0;
    }

    calculateScore(map) {
      this.score = map.zones.filter((zone) => zone.closed).reduce((score, zone) => (zone.closedBy === this)
        ? score + zone.area
        : score + zone.segments.filter((segment) => segment.consumedBy === this).length,
      0);
    }

  };

}]);
