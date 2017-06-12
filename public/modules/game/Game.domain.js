angular.module("game")

.factory("game.Game", ["generator.MapGenerator", "game.Map", "utils.playAudio", "utils.v",
function (MapGenerator, Map, playAudio, v) { // eslint-disable-line indent

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

    constructor(map, playerBuilder) {
      this.map = map;
      this.player1 = playerBuilder.buildPlayer1(this);
      this.player2 = playerBuilder.buildPlayer2(this);
      this.currentPlayer = this.player1;
      this.finished = false;
      this.draw = false;
      this.winner = null;
      this.looser = null;
    }

    switchPlayer() {
      this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
    }

    consumeSegment(segment) {
      playAudio(v("modules/game/audio/segmentConsumed.wav"));
      const justClosedAtLeastOneZone = segment.consume(this.currentPlayer);
      if (justClosedAtLeastOneZone) {
        calculateScores.call(this);
        if (this.map.areAllZonesClosed()) {
          playAudio(v("modules/game/audio/gameFinished.wav"));
          finish.call(this);
        } else {
          playAudio(v("modules/game/audio/zoneClosed.wav"));
          this.currentPlayer.play();
        }
      } else {
        this.switchPlayer();
        this.currentPlayer.play();
      }
    }

    onSegmentClick(segment) {
      if (!segment.consumed && this.currentPlayer.human) {
        this.consumeSegment(segment);
      }
    }

    start() {
      this.currentPlayer.play();
    }

    static generate(playerBuilder) {
      const data = MapGenerator.generate();
      const map = Map.build(data.points, data.segments, data.zones);
      return new Game(map, playerBuilder);
    }

  };

}]);
