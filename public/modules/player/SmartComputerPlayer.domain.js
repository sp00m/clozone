angular.module("player")

.factory("player.SmartComputerPlayer", ["player.ComputerPlayer",
function (ComputerPlayer) { // eslint-disable-line indent

  "use strict";

  const combineAvailableSegments = (zones) => [...new Set(
    zones.reduce((segments, zone) => segments.concat(zone.availableSegments), []))];

  const availableZoneComparator = (zone1, zone2) =>
    (1 === zone1.availableSegments.length || 1 === zone2.availableSegments.length)
      ? zone1.availableSegments.length - zone2.availableSegments.length
      : (2 !== zone1.availableSegments.length && 2 !== zone2.availableSegments.length)
        ? 0
        : zone2.availableSegments.length - zone1.availableSegments.length || zone1.area - zone2.area;

  const innerSegmentComparator = (segment1, segment2) => segment2.zones.length - segment1.zones.length;

  const chooseLeastWorstSegment = (worstZones) =>
    combineAvailableSegments(worstZones.filter((zone) => zone.area === worstZones[0].area))
      .sort(innerSegmentComparator)[0];

  const chooseSegment = (sortedZones) => {
    const firstZone = sortedZones[0];
    switch (firstZone.availableSegments.length) {

    case 1:
      return firstZone.availableSegments[0];

    default:
      return combineAvailableSegments(sortedZones.filter((zone) => 2 !== zone.availableSegments.length))
        .sort(innerSegmentComparator)[0];

    case 2:
      return chooseLeastWorstSegment(sortedZones);

    }
  };

  return class SmartComputerPlayer extends ComputerPlayer {

    constructor(color, game) {
      super(color, game);
    }

    consumeSegment() {
      const sortedZones = this.game.map.zones.filter((zone) => !zone.closed).sort(availableZoneComparator);
      const chosenSegment = chooseSegment(sortedZones);
      this.game.consumeSegment(chosenSegment);
    }

  };

}]);
