angular.module("game")

.factory("game.createPlayerBuilder", ["player.Player", "player.SimpleComputerPlayer", "player.SmartComputerPlayer", "game.COLOR1", "game.COLOR2",
function (Player, SimpleComputerPlayer, SmartComputerPlayer, COLOR1, COLOR2) { // eslint-disable-line indent

  "use strict";

  const createPlayerBuilder = (Player1, Player2) => ({
    buildPlayer1: (map) => new Player1(COLOR1, map),
    buildPlayer2: (map) => new Player2(COLOR2, map)
  });

  const getComputer = (feature) => {
    switch (feature) {

    case "easy":
      return SimpleComputerPlayer;

    case "hard":
      return SmartComputerPlayer;

    default:
      throw new Error(`Expected either "easy" or "hard", but got ${feature}`);

    }
  };

  const createSoloPlayerBuilder = (feature) => {
    const Computer = getComputer(feature);
    return (property) => {
      switch (property) {

      case "first":
        return createPlayerBuilder(Player, Computer);

      case "second":
        return createPlayerBuilder(Computer, Player);

      default:
        throw new Error(`Expected either "first" or "second", but got ${property}`);

      }
    };
  };

  const builders = {

    solo: {
      easy: createSoloPlayerBuilder("easy"),
      hard: createSoloPlayerBuilder("hard")
    },

    multi: {
      offline: () => createPlayerBuilder(Player, Player)
    }

  };

  return ({ mode, feature, property }) => builders[mode][feature](property);

}]);
