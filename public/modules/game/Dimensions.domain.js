angular.module("game")

.factory("game.Dimensions", ["game.X_SCALE", "game.Y_SCALE", "game.X_MARGIN", "game.Y_MARGIN",
function (X_SCALE, Y_SCALE, X_MARGIN, Y_MARGIN) { // eslint-disable-line indent

  return class Dimensions {

    constructor(width, height) {
      /* eslint-disable no-magic-numbers */
      this.xMin = Math.round(width * X_MARGIN * -1 - X_SCALE / 3);
      this.yMin = Math.round(height * Y_MARGIN * -1 - Y_SCALE / 3);
      this.width = width + this.xMin * -2;
      this.height = height + this.yMin * -2;
      this.ratio = this.height / this.width;
      /* eslint-enable no-magic-numbers */
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

}]);
