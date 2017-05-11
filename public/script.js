angular.module("generator", ["utils"])

.constant("generator.WIDTH", 10)
.constant("generator.HEIGHT", 6)
.constant("generator.MIN_SEGMENTS_PER_ROUTE", 5)
.constant("generator.NB_ROUTES", 5)

.factory("generator.Point", ["generator.WIDTH", "generator.HEIGHT",
function (WIDTH, HEIGHT) {

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
      this.isOnContour = x === 0 || x === 1 || x === WIDTH - 1 || x === WIDTH || y === 0 || y === HEIGHT;
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
      return this.x + ";" + this.y;
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

}])

.factory("generator.Segment", ["utils.getRandomValue", "generator.MIN_SEGMENTS_PER_ROUTE", "generator.NB_ROUTES",
function (getRandomValue, MIN_SEGMENTS_PER_ROUTE, NB_ROUTES) {

  const add = (segments, newSegment) => {
    if (!segments.some((segment) => segment.equals(newSegment))) {
      segments.push(newSegment);
      newSegment.p1.segments.push(newSegment);
      newSegment.p2.segments.push(newSegment);
    }
  };

  const generateSegmentsOnContour = (pointsOnContour, Segment) => pointsOnContour.reduce((segmentsOnContour, pointOnContour) => {
    const neighborsOnContour = pointOnContour.neighbors.filter((neighbor) => neighbor.isOnContour);
    neighborsOnContour.forEach((neighborOnContour) => add(segmentsOnContour, new Segment(pointOnContour, neighborOnContour)));
    return segmentsOnContour;
  }, []);

  const choosePointToLink = (point, previouslyChosenPoints) => {
    let candidates = point.neighbors.filter((neighbor) => previouslyChosenPoints.indexOf(neighbor) < 0);
    if (previouslyChosenPoints.length <= MIN_SEGMENTS_PER_ROUTE - 1) {
      candidates = candidates.filter((candidate) => !candidate.isOnContour);
    }
    return getRandomValue(candidates);
  };

  const generateRoute = (pointsOnContour, Segment) => {
    let point = getRandomValue(pointsOnContour);
    const previouslyChosenPoints = [point];
    const newSegments = [];
    do {
      const neighborToLink = choosePointToLink(point, previouslyChosenPoints);
      newSegments.push(new Segment(point, neighborToLink));
      point = neighborToLink;
      previouslyChosenPoints.push(point);
    } while (!point.isOnContour);
    return newSegments;
  };

  return class Segment {

    constructor(p1, p2) {
      this.p1 = p1;
      this.p2 = p2;
      this.isOnContour = p1.isOnContour && p2.isOnContour;
    }

    getRemainingPoint(point) {
      return this.p1 === point ? this.p2 : this.p1;
    }

    equals(otherSegment) {
      return this.p1.equals(otherSegment.p1) && this.p2.equals(otherSegment.p2)
        || this.p1.equals(otherSegment.p2) && this.p2.equals(otherSegment.p1);
    }

    static generate(points) {
      const pointsOnContour = points.filter((point) => point.isOnContour);
      const segments = generateSegmentsOnContour(pointsOnContour, Segment);
      for (let i = 0; i < NB_ROUTES; i++) {
        let failureCount = 0;
        try {
          generateRoute(pointsOnContour, Segment).forEach((newSegment) => add(segments, newSegment));
        } catch (error) {
          failureCount++;
          if (failureCount === 5) {
            throw new Error("Segments generation algorithm got stuck 5 times in a row...");
          } else {
            i--;
          }
        }
      }
      return segments;
    }

  };

}])

.factory("generator.Zone", ["utils.getRandomValue", "generator.Point",
function (getRandomValue, Point) {

  class OrientedSegment {

    constructor(segment, fromPoint) {
      this.segment = segment;
      this.fromPoint = fromPoint;
      this.toPoint = segment.getRemainingPoint(fromPoint);
    }

    isGoingRight() {
      return this.fromPoint.x < this.toPoint.x;
    }

    compareTo(otherOrientedSegment) {
      return Point.compare(this.toPoint, otherOrientedSegment.toPoint);
    }

    static compare(s1, s2) {
      return s1.compareTo(s2);
    }

  }

  const findTopLeftPoint = (segmentsOnContour) => [...segmentsOnContour.reduce((pointsOnContour, segmentOnContour) => {
    pointsOnContour.add(segmentOnContour.p1);
    pointsOnContour.add(segmentOnContour.p2);
    return pointsOnContour;
  }, new Set())]
    .sort(Point.compare)
    [0];

  const findInitialOrientedSegment = (segmentsOnContour) => {
    const topLeftPoint = findTopLeftPoint(segmentsOnContour);
    return topLeftPoint.segments.map((segment) => new OrientedSegment(segment, topLeftPoint))
      .filter((orientedSegment) => orientedSegment.isGoingRight())
      .sort(OrientedSegment.compare)
      [0];
  };

  const buildClockwiseStringifiedNeighbors = (point) => [
    new Point(point.x + 2, point.y).toString(),
    new Point(point.x + 1, point.y - 1).toString(),
    new Point(point.x - 1, point.y - 1).toString(),
    new Point(point.x - 2, point.y).toString(),
    new Point(point.x - 1, point.y + 1).toString(),
    new Point(point.x + 1, point.y + 1).toString()
  ];

  const chooseSegmentToLink = (fromPoint, toPoint, candidates) => {
    const clockwiseStringifiedNeighbors = buildClockwiseStringifiedNeighbors(toPoint);
    while (clockwiseStringifiedNeighbors[0] !== fromPoint.toString()) {
    	clockwiseStringifiedNeighbors.unshift(clockwiseStringifiedNeighbors.pop())
    }
    return candidates.sort((s1, s2) =>
      clockwiseStringifiedNeighbors.indexOf(s1.getRemainingPoint(toPoint).toString())
        - clockwiseStringifiedNeighbors.indexOf(s2.getRemainingPoint(toPoint).toString()))
      [0];
  };

  const gatherSegments = (initialOrientedSegment) => {
    let { segment, fromPoint, toPoint } = initialOrientedSegment;
    const zoneSegments = [segment];
    do {
      const candidates = toPoint.segments.filter((pointSegment) => pointSegment !== segment);
      segment = (1 === candidates.length)
        ? candidates[0]
        : chooseSegmentToLink(fromPoint, toPoint, candidates);
      zoneSegments.push(segment);
      fromPoint = toPoint;
      toPoint = segment.getRemainingPoint(toPoint);
    } while (toPoint !== initialOrientedSegment.fromPoint);
    return zoneSegments;
  };

  return class Zone {

    constructor(segments) {
      this.segments = segments;
    }

    static generate(segments) {
      const zones = [];
      const segmentsOnContour = segments.filter((segment) => segment.isOnContour);
      while (0 < segmentsOnContour.length) {
        const initialOrientedSegment = findInitialOrientedSegment(segmentsOnContour);
        const zoneSegments = gatherSegments(initialOrientedSegment);
        zones.push(new Zone(zoneSegments));
        zoneSegments.forEach((segment) => {
          if (segment.isOnContour) {
            segmentsOnContour.splice(segmentsOnContour.indexOf(segment), 1);
            segment.p1.segments.splice(segment.p1.segments.indexOf(segment), 1);
            segment.p2.segments.splice(segment.p2.segments.indexOf(segment), 1);
          } else {
            segment.isOnContour = true;
            segmentsOnContour.push(segment);
          }
        });
      }
      return zones;
    }

  };

}])

.service("generator.MapGenerator", ["generator.Point", "generator.Segment", "generator.Zone",
function (Point, Segment, Zone) {

  const generateIdentifiers = (zones) => {
    let zoneCounter = 0;
    let segmentCounter = 0;
    let pointCounter = 0;
    zones.forEach((zone) => {
      zone.id = ++zoneCounter;
      zone.segments.forEach((segment) => {
        if (!segment.hasOwnProperty("id")) {
          segment.id = ++segmentCounter;
        }
        if (!segment.p1.hasOwnProperty("id")) {
          segment.p1.id = ++pointCounter;
        }
        if (!segment.p2.hasOwnProperty("id")) {
          segment.p2.id = ++pointCounter;
        }
      });
    });
  };

  const digest = (points, segments, zones) => ({
    points: points.filter((point) => point.hasOwnProperty("id")).map((point) => ({
      id: point.id,
      x: point.x,
      y: point.y
    })),
    segments: segments.map((segment) => ({
      id: segment.id,
      p1: segment.p1.id,
      p2: segment.p2.id
    })),
    zones: zones.map((zone) => ({
      id: zone.id,
      segments: zone.segments.map((segment) => segment.id)
    }))
  });

  this.generate = function () {
    const points = Point.generate();
    const segments = Segment.generate(points);
    const zones = Zone.generate(segments);
    generateIdentifiers(zones);
    return digest(points, segments, zones);
  };

}]);

angular.module("utils", [])

.factory("utils.getRandomValue", [
function () {
  return (a) => a[Math.floor(Math.random() * a.length)];
}])

.directive("fontSize", [
function () {

  return {
    restrict: "A",
    scope: {
      ratio: "=fontSize",
      modelId: "@of"
    },
    link: function (scope, $element) {

      const $window = $(window);
      const $model = angular.element("#" + scope.modelId);
      const setFontSize = () => $element.css("font-size", ($model.width() * scope.ratio / 100) + "px");

      setFontSize();
      $window.on("resize", setFontSize);
      scope.$on("$destroy", () => $window.off("resize", setFontSize));

    }
  };

}]);

angular.module("game", ["ngAnimate", "generator", "utils"])

.constant("game.X_SCALE", 112 / 2)
.constant("game.Y_SCALE", 97)
.constant("game.MARGIN", 5 / 100)

.factory("game.Dimensions", ["game.X_SCALE", "game.Y_SCALE", "game.MARGIN",
function (X_SCALE, Y_SCALE, MARGIN) {

  return class Dimensions {

    constructor(width, height) {
      this.xMin = Math.round(width * MARGIN * -1 - X_SCALE / 3);
      this.yMin = Math.round(height * MARGIN * -1 - Y_SCALE / 3);
      this.width = width + this.xMin * -2;
      this.height = height + this.yMin * -2;
      this.ratio = this.height / this.width;
    }

    static rescale(inputPoints) {
      let width = -1;
      let height = -1;
      inputPoints.forEach((inputPoint) => {
        inputPoint.x *= X_SCALE;
        inputPoint.y *= Y_SCALE;
        if (width < inputPoint.x) {
          width = inputPoint.x;
        }
        if (height < inputPoint.y) {
          height = inputPoint.y;
        }
      });
      return new Dimensions(width, height);
    }

  };

}])

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

}])

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

}])

.factory("game.Zone", ["game.X_SCALE", "game.Y_SCALE",
function (X_SCALE, Y_SCALE) {

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

}])

.factory("game.Map", ["game.Dimensions", "game.Point", "game.Segment", "game.Zone",
function (Dimensions, Point, Segment, Zone) {

  const buildById = (a) => a.reduce((byId, e) => {
    byId[e.id] = e;
    return byId;
  }, {});

  return class Map {

    constructor(dimensions, points, segments, zones) {
      this.dimensions = dimensions;
      this.points = points;
      this.segments = segments;
      this.zones = zones;
    }

    static build(inputPoints, inputSegments, inputZones) {

      const inputPointsById = buildById(inputPoints);
      const inputSegmentsById = buildById(inputSegments);

      const dimensions = Dimensions.rescale(inputPoints);
      const points = Point.digest(inputPoints);
      const segments = Segment.digest(inputPointsById, inputSegments);
      const zones = Zone.digest(inputPointsById, inputSegmentsById, inputZones);

      return new Map(dimensions, points, segments, zones);
    }

  };

}])

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

}])

.factory("game.Game", ["game.Player",
function (Player) {

  return class Game {

    constructor(map) {
      this.map = map;
      this.player1 = new Player("#008F95");
      this.player2 = new Player("#E9B000");
      this.currentPlayer = this.player1;
    }

    switchPlayer() {
      this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
    }

    onSegmentClick(segment) {
      if (!segment.consumed) {
        if (!segment.consume(this.currentPlayer)) {
          this.switchPlayer();
        } else {
          this.player1.calculateScore(this.map);
          this.player2.calculateScore(this.map);
        }
      }
    }

  };

}])

.service("game.GameService", ["generator.MapGenerator", "game.Map", "game.Game",
function (MapGenerator, Map, Game) {

  this.generate = () => {
    const data = MapGenerator.generate();
    const map = Map.build(data.points, data.segments, data.zones);
    return new Game(map);
  };

}])

.controller("game.GameController", ["$scope", "game.GameService", function ($scope, GameService) {

  $scope.game = GameService.generate();

}]);
