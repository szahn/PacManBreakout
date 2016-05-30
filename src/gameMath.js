var camera = require("./camera");
class GameMath{
    static objectToScreenPoint(v) {
        var vector = v.clone().project(camera);
        vector.x = (vector.x + 1) / 2 * window.innerWidth;
        vector.y = -(vector.y - 1) / 2 * window.innerHeight;
        return vector;
    }
}

module.exports = GameMath;