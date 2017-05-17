angular.module("generator")

.factory("generator.Zone", ["utils.getRandomValue", "generator.Point",
function (getRandomValue, Point) { // eslint-disable-line indent

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
    .sort(Point.compare)[0];

  const findInitialOrientedSegment = (segmentsOnContour) => {
    const topLeftPoint = findTopLeftPoint(segmentsOnContour);
    return topLeftPoint.segments.map((segment) => new OrientedSegment(segment, topLeftPoint))
      .filter((orientedSegment) => orientedSegment.isGoingRight())
      .sort(OrientedSegment.compare)[0];
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
      clockwiseStringifiedNeighbors.unshift(clockwiseStringifiedNeighbors.pop());
    }
    return candidates.sort((s1, s2) =>
      clockwiseStringifiedNeighbors.indexOf(s1.getRemainingPoint(toPoint).toString())
        - clockwiseStringifiedNeighbors.indexOf(s2.getRemainingPoint(toPoint).toString()))[0];
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

}]);
