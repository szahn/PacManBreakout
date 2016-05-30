var gameDebugger = require("./gameDebugger");
var gameState = require("./gameState");
var player = require("./player");

const KEY_ENTER = 13;
const KEY_D = 68;
const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;

class GameInput{
    constructor(){
        this.keys = {
            isDown: false,
            isUp: false,
            isLeft: false,
            isRight: false    
        }   
        
    }    
   
    listen($window){
        $window.keydown((e) => {
            this.onKeyPress(e.keyCode, true);					
        }).keyup((e) => {
            this.onKeyPress(e.keyCode, false);					
        });
    }

    onKeyPress(keyCode, isPressed){
        if (gameState.state === 1){
            switch (keyCode){
                case KEY_LEFT:{
                    this.keys.isLeft = isPressed;
                    break;
                }
                case KEY_UP:{
                    this.keys.isUp = isPressed;
                    break;
                }
                case KEY_RIGHT:{
                    this.keys.isRight = isPressed;
                    break;
                }
                case KEY_DOWN:{
                    this.keys.isDown = isPressed;
                    break;
                }
                case KEY_ENTER:{
                    if (isPressed && !player.isAlive){
                        gameState.restartLevel();
                    }
                    break;
                }
            }            
        }
        else if (gameState.state === 2){
            switch (keyCode){
                case KEY_ENTER:{
                    if (isPressed){
                        gameState.start();
                    }
                    break;
                }
            }
        }
        else if (gameState.state === 3){
            switch (keyCode){
                case KEY_ENTER:{
                    if (isPressed){
                        //TODO: continue to next level
                    }
                    break;
                }
            }
        }
    }

}

module.exports = new GameInput;