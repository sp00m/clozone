angular.module("game")

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

}]);
