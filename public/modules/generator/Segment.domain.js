angular.module("generator")

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

}]);
