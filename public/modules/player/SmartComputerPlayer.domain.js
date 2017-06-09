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

  const chooseLeastWorstSegment = (availableSortedZones) =>
    combineAvailableSegments(availableSortedZones.filter((zone) => zone.area === availableSortedZones[0].area))
      .sort(innerSegmentComparator)[0];

  const chooseSegmentAmongBestCandidates = (availableSortedZones) => {
    const { excludedZones, candidatingZones } = availableSortedZones.reduce((output, zone) => {
      if (2 === zone.availableSegments.length) {
        output.excludedZones.push(zone);
      } else {
        output.candidatingZones.push(zone);
      }
      return output;
    }, { excludedZones: [], candidatingZones: [] });
    const excludedSegments = combineAvailableSegments(excludedZones);
    return combineAvailableSegments(candidatingZones)
      .filter((segment) => excludedSegments.indexOf(segment) < 0)
      .sort(innerSegmentComparator)[0];
  };

  const chooseSegment = (availableSortedZones) => {
    let chosenSegment = null;
    switch (availableSortedZones[0].availableSegments.length) {

    case 1:
      chosenSegment = availableSortedZones[0].availableSegments[0];
      break;

    default:
      chosenSegment = chooseSegmentAmongBestCandidates(availableSortedZones);
      if (chosenSegment) {
        break;
      }
      // falls through

    case 2:
      chosenSegment = chooseLeastWorstSegment(availableSortedZones);

    }
    return chosenSegment;
  };

  return class SmartComputerPlayer extends ComputerPlayer {

    constructor(color, game) {
      super(color, game);
    }

    consumeSegment() {
      const availableSortedZones = this.game.map.zones.filter((zone) => !zone.closed).sort(availableZoneComparator);
      const chosenSegment = chooseSegment(availableSortedZones);
      this.game.consumeSegment(chosenSegment);
    }

  };

}]);
