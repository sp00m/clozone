angular.module("generator")

.service("generator.LogoMapGenerator", [
function () { // eslint-disable-line indent

  "use strict";

  /* eslint-disable no-magic-numbers */
  this.generate = () => ({
    points: [
      { id: 1, x: 1, y: 0 },
      { id: 2, x: 3, y: 0 },
      { id: 3, x: 5, y: 0 },
      { id: 4, x: 7, y: 0 },
      { id: 5, x: 9, y: 0 },
      { id: 6, x: 0, y: 1 },
      { id: 7, x: 4, y: 1 },
      { id: 8, x: 6, y: 1 },
      { id: 9, x: 8, y: 1 },
      { id: 10, x: 10, y: 1 },
      { id: 11, x: 1, y: 2 },
      { id: 12, x: 3, y: 2 },
      { id: 13, x: 5, y: 2 },
      { id: 14, x: 7, y: 2 },
      { id: 15, x: 9, y: 2 },
      { id: 16, x: 0, y: 3 },
      { id: 17, x: 2, y: 3 },
      { id: 18, x: 4, y: 3 },
      { id: 19, x: 6, y: 3 },
      { id: 20, x: 8, y: 3 },
      { id: 21, x: 10, y: 3 },
      { id: 22, x: 1, y: 4 },
      { id: 23, x: 3, y: 4 },
      { id: 24, x: 5, y: 4 },
      { id: 25, x: 7, y: 4 },
      { id: 26, x: 9, y: 4 },
      { id: 27, x: 0, y: 5 },
      { id: 28, x: 4, y: 5 },
      { id: 29, x: 6, y: 5 },
      { id: 30, x: 8, y: 5 },
      { id: 31, x: 10, y: 5 },
      { id: 32, x: 1, y: 6 },
      { id: 33, x: 3, y: 6 },
      { id: 34, x: 5, y: 6 },
      { id: 35, x: 7, y: 6 },
      { id: 36, x: 9, y: 6 }
    ],
    segments: [
      { id: 1, p1: 1, p2: 2 },
      { id: 2, p1: 2, p2: 3 },
      { id: 3, p1: 3, p2: 4 },
      { id: 4, p1: 4, p2: 5 },
      { id: 5, p1: 1, p2: 6 },
      { id: 6, p1: 5, p2: 10 },
      { id: 7, p1: 7, p2: 8 },
      { id: 8, p1: 8, p2: 9 },
      { id: 9, p1: 6, p2: 11 },
      { id: 10, p1: 7, p2: 12 },
      { id: 11, p1: 9, p2: 14 },
      { id: 12, p1: 10, p2: 15 },
      { id: 13, p1: 13, p2: 14 },
      { id: 14, p1: 14, p2: 15 },
      { id: 15, p1: 11, p2: 16 },
      { id: 16, p1: 12, p2: 17 },
      { id: 17, p1: 13, p2: 18 },
      { id: 18, p1: 15, p2: 20 },
      { id: 19, p1: 15, p2: 21 },
      { id: 20, p1: 18, p2: 19 },
      { id: 21, p1: 16, p2: 22 },
      { id: 22, p1: 17, p2: 22 },
      { id: 23, p1: 19, p2: 24 },
      { id: 24, p1: 20, p2: 25 },
      { id: 25, p1: 21, p2: 26 },
      { id: 26, p1: 22, p2: 23 },
      { id: 27, p1: 23, p2: 24 },
      { id: 28, p1: 25, p2: 26 },
      { id: 29, p1: 22, p2: 27 },
      { id: 30, p1: 24, p2: 28 },
      { id: 31, p1: 26, p2: 30 },
      { id: 32, p1: 26, p2: 31 },
      { id: 33, p1: 28, p2: 29 },
      { id: 34, p1: 29, p2: 30 },
      { id: 35, p1: 27, p2: 32 },
      { id: 36, p1: 31, p2: 36 },
      { id: 37, p1: 32, p2: 33 },
      { id: 38, p1: 33, p2: 34 },
      { id: 39, p1: 34, p2: 35 },
      { id: 40, p1: 35, p2: 36 }
    ],
    zones: [
      { id: 1, segments: [1, 2, 3, 4, 6, 12, 14, 8, 7, 10, 16, 22, 21, 15, 9, 5] },
      { id: 2, segments: [7, 8, 11, 13, 17, 20, 23, 27, 26, 22, 16, 10] },
      { id: 3, segments: [13, 14, 18, 24, 28, 31, 34, 33, 30, 23, 20, 17] },
      { id: 4, segments: [19, 25, 28, 24, 18] },
      { id: 5, segments: [26, 27, 30, 33, 34, 31, 32, 36, 40, 39, 38, 37, 35, 29] }
    ]
  });
  /* eslint-enable no-magic-numbers */

}]);
