var renderer = require("./renderer");
var scene = require("./scene");
var camera = require("./camera");
var GameInput = require("./gameInput");
var gamepad = require("./gamepad");
var player = require("./player");
var collision = require("./collision");
var level = require("./level");
var hud = require("./hud");
var gameState = require("./gameState");
var sounds = require("./sounds");

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function boxIntersectsWithXY(a, b, dX, dY){
    return (a.min.x - (dX || 0) <= b.max.x &&
        a.max.x + (dX || 0) >= b.min.x &&
        a.min.y - (dY || 0) <= b.max.y &&
        a.max.y + (dY || 0) >= b.min.y)
}


class GameLoop {
    constructor(){
        this.playerMoveTimer = 0;
        this.coinAnimTimer = 0;
    }
    
    tickGhouls(ticks){
        let ghouls = scene.root.ghouls;
        for (let i = 0; i < ghouls.length; i++){
            let ghoul = ghouls[i];
            if (!ghoul){
                continue;
            }
                
            var playerBox = new THREE.Box3().setFromObject(player.objects.mesh);              
            if (boxIntersectsWithXY(playerBox, ghoul.userData.box)){
                sounds.play("hurt");
                if (player.powerTimer > 0){
                    scene.remove(ghoul);
                    delete ghouls[i];
                    continue;
                }
                else{
                    player.isAlive = false;
                    scene.remove(player.objects.mesh);
                    scene.remove(player.objects.light);      
                }
            }               
                
            let floors = [];
            for(let floor of scene.getCollection("floors")){
                if (boxIntersectsWithXY(ghoul.userData.box, floor.userData.box)){
                    floors.push(floor.id);
                }
            }
            
            if (!floors.length){
                //scene.remove(ghoul);
                //delete ghouls[i];
                continue;
            }
               
            if (player.isAlive){
                let playerDiffX = Math.abs(player.objects.mesh.position.x - ghoul.position.x)
                let playerDiffY = Math.abs(player.objects.mesh.position.y - ghoul.position.y);
                if (playerDiffX < 2 && playerDiffY < 2){
                    if (playerDiffY < playerDiffX){
                        if (player.objects.mesh.position.x < ghoul.position.x){
                            ghoul.userData.nextDirection = 3;
                        }
                        else{
                            ghoul.userData.nextDirection = 1;
                        }
                    }
                    else{
                        if (player.objects.mesh.position.y < ghoul.position.y){
                            ghoul.userData.nextDirection = 2;
                        }
                        else{
                            ghoul.userData.nextDirection = 0;
                        }
                    }
                }                
            }

            if (ghoul.userData.nextDirection !== ghoul.userData.direction){
                ghoul.userData.direction = ghoul.userData.nextDirection;
            }
            
            let vX = 0, vY = 0;
            switch (ghoul.userData.direction){
                case 0:{
                    vY = 1.4 * ticks;
                    break;
                }
                case 1:{
                    vX = 1.4 * ticks;
                    break;
                }
                case 2:{
                    vY = -1.4 * ticks;
                    break;
                }
                case 3:{
                    vX = -1.4 * ticks;
                    break;
                }
            }               
            
            let didCollide = false;
            for(let f = 0; f < floors.length; f++){
                let group = scene.groups[floors[f]];
                if (ghoul.userData.direction === 0 || ghoul.userData.direction === 2){
                    if (collision.doGhoulHitDetection(ghoul, group, 0, vY)){
                        didCollide = true;
                        if (ghoul.userData.direction == 0){
                            while (ghoul.userData.direction == 0){
                                ghoul.userData.direction = ghoul.userData.nextDirection = getRandomInt(0, 3);
                            }
                        }
                        else{
                            while (ghoul.userData.direction == 2){
                                ghoul.userData.direction = ghoul.userData.nextDirection = getRandomInt(0, 3);
                            }
                        }
                        continue;
                    }
                }
                else if (ghoul.userData.direction === 1 || ghoul.userData.direction === 3){
                    if (collision.doGhoulHitDetection(ghoul, group, vX, 0)){
                        didCollide = true;
                        if (ghoul.userData.direction == 1){
                            while (ghoul.userData.direction == 1){
                                ghoul.userData.direction = ghoul.userData.nextDirection = getRandomInt(0, 3);
                            }
                        }
                        else{
                            while (ghoul.userData.direction == 3){
                                ghoul.userData.direction = ghoul.userData.nextDirection = getRandomInt(0, 3);
                            }
                        }
                        continue;
                    }
                }                 
            }
            
            if (!didCollide){
                let gX = parseFloat((ghoul.position.x + vX).toFixed(2));
                let gY = parseFloat((ghoul.position.y + vY).toFixed(2));

                ghoul.position.set(gX, gY,ghoul.position.z);
                ghoul.userData.box = new THREE.Box3().setFromObject(ghoul);
            }
        }
    }
    
    tickPlayer(ticks){
        if (!player.isAlive){
            return;
        }
        
        if (player.powerTimer > 0){
            player.powerTimer -= 1.8* ticks;
            if (player.powerTimer < 0) {
                player.powerTimer = 0;
                let ghouls = scene.root.ghouls;
                for (let i = 0; i < ghouls.length; i++){
                    let ghoul = ghouls[i];
                    if (!ghoul){
                        continue;
                    }
                    
                    ghoul.material.color = new THREE.Color(1,0,0);
                }
            }
        }
        
        if (player.nextDirection !== player.direction){
            player.direction = player.nextDirection;
        }
        
        var floors = [];
        var playerBox = new THREE.Box3().setFromObject(player.objects.mesh);              
        let vX = 0, vY = 0;
        switch (player.direction){
            case 0:{
                vY = 1.6 * ticks;
                break;
            }
            case 1:{
                vX = 1.6 * ticks;
                break;
            }
            case 2:{
                vY = -1.6 * ticks;
                break;
            }
            case 3:{
                vX = -1.6 * ticks;
                break;
            }
        }
        
        for(let floor of scene.getCollection("floors")){
            if (boxIntersectsWithXY(playerBox, floor.userData.box)){
                player.currentRoom = floor.name;
                player.roomId = floor.id;
                floors.push(floor.id);
            }
        }
        
        if (!floors.length){
            player.isAlive = false;
            scene.remove(player.objects.mesh);
            scene.remove(player.objects.light);      
            return;      
        }

        var gamepadKeys = gamepad.getButtons();

        var isDown = GameInput.keys.isDown || gamepadKeys.isDown;
        var isUp = GameInput.keys.isUp || gamepadKeys.isUp;
        var isRight = GameInput.keys.isRight || gamepadKeys.isRight;
        var isLeft = GameInput.keys.isLeft || gamepadKeys.isLeft;

        if (isDown && player.delayY === 0){
            player.nextDirection = 2;
        }
        else if (isUp && player.delayY === 0){
            player.nextDirection = 0;
        }
        else if (isRight && player.delayX === 0){
            player.nextDirection = 1;
        }
        else if (isLeft && player.delayX === 0){
            player.nextDirection = 3;
        }

        if (player.delayX > 0){
            player.delayX -= 2 * ticks;
            if (player.delayX <= .1) {
                player.delayX = 0;
            }
        }

        if (player.delayY > 0){
            player.delayY -= 2 * ticks;
            if (player.delayY <= .1) {
                player.delayY = 0;
            }
        }
        
        for(let floorId of floors){
            if (player.direction === 0 || player.direction === 2){
                if (collision.doPlayerHitDetection(floorId, 0, vY)){
                    player.delayY = .5;
                    if (player.direction == 0){
                        player.direction = player.nextDirection = 2
                    }
                    else{
                        player.direction = player.nextDirection = 0
                    }
                    return;
                }
            }
            else if (player.direction === 1 || player.direction === 3){
                if (collision.doPlayerHitDetection(floorId, vX, 0)){
                    player.delayX = .5;
                    if (player.direction == 1){
                        player.direction = player.nextDirection = 3
                    }
                    else{
                        player.direction = player.nextDirection = 1
                    }
                    return;
                }
            }      
        }

        let playerX = parseFloat((player.objects.mesh.position.x + vX).toFixed(2));
        let playerY = parseFloat((player.objects.mesh.position.y + vY).toFixed(2));

        player.objects.mesh.position.set(playerX, playerY, player.objects.mesh.position.z);
        player.objects.light.position.set(playerX, playerY, player.objects.light.position.z)
    
        camera.position.set(player.objects.mesh.position.x, player.objects.mesh.position.y, 6);
    }
    
    tick(ticks){
        if (this.coinAnimTimer <= 0){
            this.coinAnimTimer = 1;
            scene.selectAllCollections("coins").forEach((t)=>{
                t.rotateX(14 * ticks);
                t.rotateY(-14 * ticks);
            });
        }
        else{
            this.coinAnimTimer -= 5 *ticks;
        }

        if (gameState.state !== 1){
            return;
        }
        
        scene.selectAllCollections("portals").forEach((p)=>{
            if (p.userData.timeout > 0){
                p.userData.timeout -=1 * ticks;
                if (p.userData.timeout <= 0 ){
                    p.userData.timeout = 0;
                }
            }
            p.material.rotation += (1 * ticks);
        });
        
        this.tickPlayer(ticks);
        this.tickGhouls(ticks);
    }

    render() {            
        this.clock = new THREE.Clock(true);            
        if (gameState.state === 1){
            this.tick(this.clock.getDelta());
            renderer.render(scene, camera);
        }
        requestAnimationFrame(this.renderX.bind(this));
    }
    
    renderX(){
        if (gameState.state === 1){
            this.tick(this.clock.getDelta());
            renderer.render(scene, camera);
        }
        requestAnimationFrame(this.renderX.bind(this));
    }
    
}

module.exports = new GameLoop();