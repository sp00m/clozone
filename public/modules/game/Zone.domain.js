angular.module("game")

.factory("game.Zone", ["game.X_SCALE", "game.Y_SCALE",
function (X_SCALE, Y_SCALE) { // eslint-disable-line indent

  "use strict";

  const linkSegment = function (segment) {
    this.segments.push(segment);
    segment.zones.push(this);
  };

  const initInputPointIds = function (inputPointIds, inputSegmentsById) {
    const firstInputSegment = inputSegmentsById[this.inputZone.segments[0]];
    const secondInputSegment = inputSegmentsById[this.inputZone.segments[1]];
    if (firstInputSegment.p2 === secondInputSegment.p1 || firstInputSegment.p2 === secondInputSegment.p2) {
      inputPointIds.push(firstInputSegment.p1);
    } else {
      inputPointIds.push(firstInputSegment.p2);
    }
    const lastInputSegment = inputSegmentsById[this.inputZone.segments.pop()];
    linkSegment.call(this, lastInputSegment.digested);
  };

  const completeInputPointIds = function (inputPointIds, inputSegmentsById) {
    this.inputZone.segments.forEach((inputSegmentId) => {
      const inputSegment = inputSegmentsById[inputSegmentId];
      linkSegment.call(this, inputSegment.digested);
      if (inputPointIds[inputPointIds.length - 1] === inputSegment.p1) {
        inputPointIds.push(inputSegment.p2);
      } else {
        inputPointIds.push(inputSegment.p1);
      }
    });
  };

  const buildPointsCoordinates = function (inputPointsById, inputSegmentsById) {
    const inputPointIds = [];
    initInputPointIds.call(this, inputPointIds, inputSegmentsById);
    completeInputPointIds.call(this, inputPointIds, inputSegmentsById);
    return inputPointIds.reduce((pointsCoordinates, inputPointId) => {
      const inputPoint = inputPointsById[inputPointId];
      pointsCoordinates.push(inputPoint.x);
      pointsCoordinates.push(inputPoint.y);
      return pointsCoordinates;
    }, []);
  };

  const calculateArea = function () {
    let area = 0;
    for (let i = 0, j = this.points.length - 2; i < this.points.length; j = i, i += 2) {
      area += (this.points[j] + this.points[i]) * (this.points[j + 1] - this.points[i + 1]);
    }
    return Math.abs(Math.round(area / (2 * X_SCALE * Y_SCALE)));
  };

  return class Zone {

    constructor(inputPointsById, inputSegmentsById, inputZone) {
      this.inputZone = inputZone;
      this.segments = [];
      this.points = buildPointsCoordinates.call(this, inputPointsById, inputSegmentsById);
      this.area = calculateArea.call(this);
      this.color = "transparent";
      this.closed = false;
    }

    close(player) {
      if (!this.closed && this.segments.every((segment) => segment.consumed)) {
        this.color = player.color;
        this.closed = true;
        this.closedBy = player;
      }
      return this.closed;
    }

    static digest(inputPointsById, inputSegmentsById, inputZones) {
      return inputZones.map((inputZone) => angular.extend(inputZone, {
        digested: new Zone(inputPointsById, inputSegmentsById, inputZone)
      }).digested);
    }

  };

}]);
