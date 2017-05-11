angular.module("game")

.factory("game.Segment", ["game.Y_SCALE",
function (Y_SCALE) {

  const buildClickableAreaPointsForHorizontalSegment = function () {
    const xCenter = Math.round(Math.min(this.x1, this.x2) + Math.abs(this.x1 - this.x2) / 2);
    const yTop = Math.round(this.y1 - Y_SCALE / 3);
    const yBottom = Math.round(this.y1 + Y_SCALE / 3);
    return [this.x1, this.y1, xCenter, yTop, this.x2, this.y2, xCenter, yBottom];
  };

  const buildClickableAreaPointsForDescendingSegment = function (xLeft, yLeft, xRight, yRight) {
    const yAbove = Math.round(yLeft + Y_SCALE / 3);
    const yUnder = Math.round(yRight - Y_SCALE / 3);
    return [xLeft, yLeft, xRight, yAbove, xRight, yRight, xLeft, yUnder];
  };

  const buildClickableAreaPointsForAscendingSegment = function (xLeft, yLeft, xRight, yRight) {
    const yAbove = Math.round(yRight + Y_SCALE / 3);
    const yUnder = Math.round(yLeft - Y_SCALE / 3);
    return [xLeft, yLeft, xLeft, yAbove, xRight, yRight, xRight, yUnder];
  };

  const buildClickableAreaPointsForObliqueSegment = function () {
    let xLeft;
    let yLeft;
    let xRight;
    let yRight;
    if (this.x1 < this.x2) {
      xLeft = this.x1;
      yLeft = this.y1;
      xRight = this.x2;
      yRight = this.y2;
    } else {
      xLeft = this.x2;
      yLeft = this.y2;
      xRight = this.x1;
      yRight = this.y1;
    }
    return (yLeft < yRight)
      ? buildClickableAreaPointsForDescendingSegment.call(this, xLeft, yLeft, xRight, yRight)
      : buildClickableAreaPointsForAscendingSegment.call(this, xLeft, yLeft, xRight, yRight);
  };

  const buildClickableAreaPoints = function () {
    return (this.y1 === this.y2)
      ? buildClickableAreaPointsForHorizontalSegment.call(this)
      : buildClickableAreaPointsForObliqueSegment.call(this);
  };

  return class Segment {

    constructor(inputPointsById, inputSegment) {
      const p1 = inputPointsById[inputSegment.p1];
      const p2 = inputPointsById[inputSegment.p2];
      this.inputSegment = inputSegment;
      this.x1 = p1.x;
      this.y1 = p1.y;
      this.x2 = p2.x;
      this.y2 = p2.y;
      this.clickableAreaPoints = buildClickableAreaPoints.call(this);
      this.color = "lightgray";
      this.consumed = false;
      this.zones = [];
    }

    consume(player) {
      let closedAtLeastOneZone = false;
      if (!this.consumed) {
        this.consumed = true;
        this.consumedBy = player;
        this.color = player.color;
        this.zones.forEach((zone) => {
          closedAtLeastOneZone |= zone.close(player);
        });
      }
      return closedAtLeastOneZone;
    }

    static digest(inputPointsById, inputSegments) {
      return inputSegments.map((inputSegment) => angular.extend(inputSegment, {
        digested: new Segment(inputPointsById, inputSegment)
      }).digested);
    }

  };

}]);
