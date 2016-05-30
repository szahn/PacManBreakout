var viewport = require("./viewport");
var player = require("./player");
var level = require("./level");
var gameState = require("./gameState");
var assetCache = require("./assetCache");
var sounds = require("./sounds");
var textures = require("./textures");

class HUD {

    constructor(){
        this.font = new Image();
        this.font.src = "assets/font.png";           
        this.backdrop = new Image();
        this.backdrop.src = "assets/backdrop.jpg";           
        this.title = new Image();
        this.title.src = "assets/title.png";           
        this.totalAssets = assetCache.assetsToLoad + textures.texturesToLoad + sounds.soundsToLoad;     
        this.showText = false;
        setInterval(()=>this.showText = !this.showText, 500);
    }
    
    drawText(text, x, y, color, alignment = "left"){
        let ctx = this.context;
        let fixedText = text.toUpperCase();
        let letterCount = fixedText.length;
        let letterWidth = 6;
        let letterHeight = 7;
        let width = (letterWidth * letterCount);
        let charX = alignment === "left" ? x : alignment === "center" ? x - (width / 2) : charX = x - width;
        let charY = y;
        let srcY = color * 8;
        for (let i = 0; i < letterCount; i++){
            let isCtrlChar = false;
            let srcX = 0;
            let charCode = fixedText.charCodeAt(i);
            if (charCode == 47){
                charY += letterHeight;
                width = (letterWidth * (letterCount - i));
                charX = alignment === "left" ? x - 1 : alignment === "center" ? x - (width / 2) : charX = x - width;
                continue;
            }

            if (charCode >= 48 && charCode <=57){
                srcX = 208 + ((charCode - 48) * 8);
            }
            else if (charCode >= 65 && charCode <=90){
                srcX =  0 + ((charCode - 65) * 8);
            }
            else if (charCode === 32){
                isCtrlChar = true;
            }
            else if (charCode === 33){
                srcX =  304;
            }

            if (!isCtrlChar){
                ctx.drawImage(this.font, srcX, srcY, 8, 8, charX, charY, 8, 8);
            }
            charX += letterWidth;
        }
    }

    init(){
        if (this.canvas){
            return;
        }
        this.canvas = document.createElement("canvas");
        let $canvas = $(this.canvas);
        this.width = Math.round(viewport.getSize().width / 4);
        this.height = Math.round(viewport.getSize().height / 4);
        $canvas.attr("width", this.width)
            .attr("height", this.height)
            .css({
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                width: "100%",
                height: "100%",
                "z-index": 99
        });
        this.context = this.canvas.getContext('2d');
        this.context.font = "Bold 12px Courier New";
        this.context.fillStyle= "#fff";
        this.context.mozImageSmoothingEnabled = false;
        this.context.webkitImageSmoothingEnabled = false;
        this.context.msImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = false;
        this.context.scale(1, 1);
        document.body.appendChild(this.canvas); 
    }
    
    drawBackdrop(){
        let ctx = this.context;
        if (!this.backdrop.width || !this.backdrop.height){
            ctx.clearRect(0, 0, this.width, this.height);
            return;
        }
        for (let x= 0; x < this.width / this.backdrop.width; x++){
            for (let y= 0; y < this.height / this.backdrop.height; y++){
                ctx.drawImage(this.backdrop, x * this.backdrop.width, y * this.backdrop.height);
            }
        }        
    }

    drawTitle(){
        if (this.title){
            this.context.drawImage(this.title, this.width /2 - (this.title.width / 2), 10);
        }
    }
    
    drawCopyright(){
        let ctx = this.context;       
        let charX = 2;
        let charY = this.height - 10;
        ctx.drawImage(this.font, 312, 32, 8, 8, charX, charY, 8, 8);        
        this.drawText("Stuart Zahn", charX + 10, charY, 4);
    }

    draw(){
        let ctx = this.context;       
        switch (gameState.state){
            case 0:{
                this.drawBackdrop();
                this.drawTitle();
                let assetsLoaded = (this.totalAssets - (assetCache.assetsToLoad + textures.texturesToLoad + sounds.soundsToLoad)) / this.totalAssets;
                this.drawText(`Loading`, this.width / 2, this.height / 2 - 10, 0, "center");            
                ctx.fillStyle= "#666";
                ctx.fillRect(this.width / 2 - (39 / 2), this.height / 2, 37, 4)
                ctx.fillStyle= "#fff";
                ctx.fillRect(this.width / 2 - (39 / 2), this.height / 2, 37 * assetsLoaded, 4)
                this.drawCopyright();
                break;
            }
            case 2:{
                this.drawBackdrop();
                this.drawTitle();
                let y = 30;
                this.drawText("How to Play", this.width / 2, y, 0, "center");            
                this.drawText("Collect all coins to win", this.width / 2, y + 20, 3, "center");            
                this.drawText("Use Arrow Keys/or Gamepad to move", 10, y + 35, 4);            
                this.drawText("Gather powerups/to kill ghouls", 10, y + 55, 4);            
                this.drawText("Bump walls/to remove them", 10, y + 75, 4);                            
                this.drawCopyright();
                if (this.showText) this.drawText("Press Enter to Start", this.width / 2, this.height - 25,1, "center");            
                break;
            }
            case 1:{
                ctx.clearRect(0, 0, this.width, this.height);
                if (!player.isAlive){
                    ctx.fillStyle= "rgba(0,0,0,.5)";
                    ctx.fillRect(0, 0, this.width, this.height);
                    this.drawTitle();
                    this.drawText("Game Over!", this.width / 2, this.height / 2 - 10, 2, "center");            
                    if (this.showText) this.drawText("Press Enter to Try Again", this.width / 2, this.height - 25,1, "center");            
                }
                else{
                    let coinsLeft = (level.totalCoins - player.coinCount);
                    if (coinsLeft < 100){ coinsLeft = `0${coinsLeft}`;}
                    if (coinsLeft < 10){ coinsLeft = `0${coinsLeft}`;}
                    this.drawText(`${coinsLeft} Coins`, 10, 10, 1);
                    this.drawText(player.currentRoom, 10, this.height - 20, 0);
                    this.drawText(`Level 01`, this.width - 60, 10, 0);
                }
                break;
            }
            case 3:{
                ctx.clearRect(0, 0, this.width, this.height);
                ctx.fillStyle= "rgba(0,0,0,.5)";
                ctx.fillRect(0, 0, this.width, this.height);
                this.drawTitle();
                this.drawText("Success!", this.width / 2, this.height / 2 - 10, 3, "center");            
                if (this.showText) this.drawText("Press Enter to Play Again", this.width / 2, this.height - 25,1, "center");            
                break;
            }
            case 4:{
                ctx.clearRect(0, 0, this.width, this.height);
                this.drawText("Paused", this.width / 2, this.height / 2 - 10, 0, "center");            
                break;
            }
        }
        
        
        requestAnimationFrame(this.draw.bind(this));
    }    

}

module.exports = new HUD();