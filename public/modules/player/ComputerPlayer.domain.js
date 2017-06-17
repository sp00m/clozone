angular.module("player")

.factory("player.ComputerPlayer", ["player.Player", "player.THINKING_WAIT_TIME_IN_MILLIS", "$timeout",
function (Player, THINKING_WAIT_TIME_IN_MILLIS, $timeout) { // eslint-disable-line indent

  "use strict";

  return class ComputerPlayer extends Player {

    constructor(color, game) {
      super(color);
      this.human = false;
      this.game = game;
    }

    consumeSegment() { // eslint-disable-line class-methods-use-this
      // noop
    }

    play() {
      $timeout(() => {
        this.consumeSegment();
      }, THINKING_WAIT_TIME_IN_MILLIS);
    }

  };

}]);
