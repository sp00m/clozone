angular.module("game")

.factory("game.Game", ["generator.MapGenerator", "game.Map", "game.Player", "utils.playAudio",
function (MapGenerator, Map, Player, playAudio) { // eslint-disable-line indent

  "use strict";

  const calculateScores = function () {
    this.player1.calculateScore(this.map);
    this.player2.calculateScore(this.map);
  };

  const finish = function () {
    this.finished = true;
    if (this.player1.score < this.player2.score) {
      this.winner = this.player2;
      this.looser = this.player1;
    } else {
      this.winner = this.player1;
      this.looser = this.player2;
      this.draw = this.player1.score === this.player2.score;
    }
  };

  return class Game {

    constructor(map) {
      this.map = map;
      this.player1 = new Player("#008F95");
      this.player2 = new Player("#E9B000");
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
        playAudio("modules/game/audio/segmentConsumed.wav");
        const closedAtLeastOneZone = segment.consume(this.currentPlayer);
        if (closedAtLeastOneZone) {
          calculateScores.call(this);
          if (this.map.areAllZonesClosed()) {
            playAudio("modules/game/audio/gameFinished.wav");
            finish.call(this);
          } else {
            playAudio("modules/game/audio/zoneClosed.wav");
          }
        } else {
          this.switchPlayer();
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
