angular.module("game")

.factory("game.Game", ["generator.MapGenerator", "game.Map", "game.Player",
function (MapGenerator, Map, Player) { // eslint-disable-line indent

  return class Game {

    constructor(map) {
      this.map = map;
      this.player1 = new Player("#008F95", "modules/game/audio/action1.wav");
      this.player2 = new Player("#E9B000", "modules/game/audio/action2.wav");
      this.currentPlayer = this.player1;
      this.finished = false;
      this.draw = false;
      this.winner = null;
      this.looser = null;
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
          if (this.map.areAllZonesClosed()) {
            this.finished = true;
            if (this.player2.score < this.player1.score) {
              this.winner = this.player1;
              this.looser = this.player2;
            } else if (this.player1.score < this.player2.score) {
              this.winner = this.player2;
              this.looser = this.player1;
            } else {
              this.draw = true;
            }
          }
        }
      }
    }

    static generate() {
      const data = MapGenerator.generate();
      const map = Map.build(data.points, data.segments, data.zones);
      return new Game(map);
    }

  };

}]);
