class Gamepad{
    
    constructor(){
        this.haveEvents = 'GamepadEvent' in window;
        this.haveWebkitEvents = 'WebKitGamepadEvent' in window;
        this.gamepads = {};
    }
    
    scanGamepads() {
        var g = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
        for (var i = 0; i < g.length; i++) {
            if (g[i]) {
                if (!(g[i].index in this.gamepads)) {
                    this.addGamepad(g[i]);
                } else {
                    this.gamepads[g[i].index] = g[i];
                }
            }
        }
    }

    /*test: http://luser.github.io/gamepadtest/ */
    getButtons(){
        this.scanGamepads();
        var keys = {isDown: false, isUp: false, isLeft: false, isRight: false};
        if (!this.gamepads || !this.gamepads[0]){
            return keys;
        }
        
        var gp = this.gamepads[0];        
        keys.isUp = Math.round(gp.axes[1]) < 0;
        keys.isDown = Math.round(gp.axes[1]) > 0;
        keys.isLeft = Math.round(gp.axes[0]) < 0;
        keys.isRight = Math.round(gp.axes[0]) > 0;
        return keys;
    }
    
    connectHandler(e) {
        console.log("gamepad connected");
        this.addGamepad(e.gamepad);
    }
    
    addGamepad(gamepad) {
        this.gamepads[gamepad.index] = gamepad;
    }
    
    disconnectHandler(e) {
        console.log("gamepad disconnected");
        this.removeGamepad(e.gamepad);
    }
    
    removeGamepad(gamepad) {
        delete this.gamepads[gamepad.index];
    }
    
    listen(){
        if (this.haveEvents) {
            window.addEventListener("gamepadconnected", this.connectHandler.bind(this));
            window.addEventListener("gamepaddisconnected", this.disconnectHandler.bind(this));
        } else if (this.haveWebkitEvents) {
            window.addEventListener("webkitgamepadconnected", this.connectHandler.bind(this));
            window.addEventListener("webkitgamepaddisconnected", this.disconnectHandler.bind(this));
        } else {

        }
       
        window.addEventListener("gamepadconnected", (e) => {
            var gp = navigator.getGamepads()[e.gamepad.index];
            this.gamepads[gp.index] = gp;
            console.log(`Gamepad ${gp.id} connected.`);
        });
        
        window.addEventListener("gamepaddisconnected", (e) => {
            var gp = e.gamepad;
            delete this.gamepads[gp.index];
            console.log(`Gamepad ${gp.id} disconnected.`);
        });
       
    }
}

module.exports = new Gamepad();