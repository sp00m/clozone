angular.module("generator")

.factory("generator.Point", ["generator.WIDTH", "generator.HEIGHT",
function (WIDTH, HEIGHT) { // eslint-disable-line indent

  "use strict";

  const addNeighbor = (point, pointsByCoords, x, y) => {
    if (pointsByCoords.hasOwnProperty(y) && pointsByCoords[y].hasOwnProperty(x)) {
      point.neighbors.push(pointsByCoords[y][x]);
    }
  };

  const gatherNeighbors = (point, pointsByCoords) => {
    addNeighbor(point, pointsByCoords, point.x - 2, point.y);
    addNeighbor(point, pointsByCoords, point.x - 1, point.y - 1);
    addNeighbor(point, pointsByCoords, point.x + 1, point.y - 1);
    addNeighbor(point, pointsByCoords, point.x + 2, point.y);
    addNeighbor(point, pointsByCoords, point.x + 1, point.y + 1);
    addNeighbor(point, pointsByCoords, point.x - 1, point.y + 1);
  };

  return class Point {

    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.isOnContour = 0 === x || 1 === x || WIDTH - 1 === x || WIDTH === x || 0 === y || HEIGHT === y;
      this.neighbors = [];
      this.segments = [];
    }

    equals(otherPoint) {
      return this.x === otherPoint.x && this.y === otherPoint.y;
    }

    compareTo(otherPoint) {
      return this.y - otherPoint.y || this.x - otherPoint.x;
    }

    toString() {
      return `${this.x};${this.y}`;
    }

    static compare(p1, p2) {
      return p1.compareTo(p2);
    }

    static generate() {
      const points = [];
      const pointsByCoords = {};
      for (let y = 0; y <= HEIGHT; y++) {
        pointsByCoords[y] = {};
        for (let x = (y + 1) % 2; x <= WIDTH; x += 2) {
          const point = new Point(x, y);
          points.push(point);
          pointsByCoords[y][x] = point;
        }
      }
      points.forEach((point) => gatherNeighbors(point, pointsByCoords));
      return points;
    }

  };

}]);
