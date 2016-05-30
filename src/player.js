class Player{
    constructor(){
        this.reset();
    }
    
    reset(){
        this.direction = -1;
        this.nextDirection = -1;
        this.powerTimer = 0;
        this.coinCount = 0;
        this.isAlive = true;
        this.delayX = 0;
        this.delayY = 0;
        this.currentRoom = "";
        this.roomId = -1;
    }
}

module.exports = new Player();