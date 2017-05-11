angular.module("game")

.service("game.GameService", ["generator.MapGenerator", "game.Map", "game.Game",
function (MapGenerator, Map, Game) {

  this.generate = () => {
    const data = MapGenerator.generate();
    const map = Map.build(data.points, data.segments, data.zones);
    return new Game(map);
  };

}]);
