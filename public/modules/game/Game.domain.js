angular.module("game")

.factory("game.Game", ["game.Player",
function (Player) { // eslint-disable-line indent

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

}]);
