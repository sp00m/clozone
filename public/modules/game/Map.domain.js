angular.module("game")

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

}]);
