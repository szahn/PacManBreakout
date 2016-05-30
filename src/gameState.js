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
    
}

module.exports = new GameState();