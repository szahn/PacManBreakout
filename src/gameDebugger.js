var player = require("./player");
var gameMath = require("./gameMath");

class GameDebugger{
    constructor(){
        this.showDebug = false;
    }
    
    static toggleDebugInfo(){
        this.showDebug = !this.showDebug;
        var playerPos = gameMath.objectToScreenPoint(player.objects.mesh.position);
        console.log(`Player ${playerPos.x}x${playerPos.y}`);
    }
}

module.exports = GameDebugger;