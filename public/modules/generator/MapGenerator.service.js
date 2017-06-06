angular.module("generator")

.service("generator.MapGenerator", ["generator.Point", "generator.Segment", "generator.Zone",
function (Point, Segment, Zone) { // eslint-disable-line indent

  "use strict";

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
