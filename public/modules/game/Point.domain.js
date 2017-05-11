angular.module("game")

.factory("game.Point", [
function () {

  return class Point {

    constructor(inputPoint) {
      this.inputPoint = inputPoint;
      this.cx = inputPoint.x;
      this.cy = inputPoint.y;
      this.color = "lightgray";
    }

    static digest(inputPoints) {
      return inputPoints.map((inputPoint) => angular.extend(inputPoint, {
        digested: new Point(inputPoint)
      }).digested);
    }

  };

}]);
