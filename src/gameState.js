var scene = require("./scene");
var player = require("./player");
var level = require("./level");
class GameState{
    constructor(){
        this.state = 0;
    }
    
    start(){
        this.state = 1;
    }
    
    showHelp(){
        this.state = 2;
    }
    
    win(){
        this.state = 3;
    }
    
    pause(){
        this.state = 4;
    }
    
    restartLevel(){
        this.state = 5;
        scene.reset();
        player.reset();
        level.reset();
        level.makeLevel("assets/level1.json").then(()=>{
            this.state = 1;            
        });
    }
    
}

module.exports = new GameState();