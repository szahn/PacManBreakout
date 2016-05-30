var scene = require("./scene");
var player = require("./player");
var level = require("./level");
var log = require("./log");
var sounds = require("./sounds");
var gameState = require("./gameState");

function boxIntersectsWithXY(a, b, dX, dY){
    if (dX < 0){
        
    }
    else if (dY < 0){
        return (a.min.x - (dX || 0) <= b.max.x &&
            a.max.x + (dX || 0) >= b.min.x &&
            a.min.y + (dY || 0) <= b.max.y &&
            a.max.y - (dY || 0) >= b.min.y)
    }

    return (a.min.x - (dX || 0) <= b.max.x &&
        a.max.x + (dX || 0) >= b.min.x &&
        a.min.y - (dY || 0) <= b.max.y &&
        a.max.y + (dY || 0) >= b.min.y)    
}

class Collision {
    
    onPlayerMovement(){
        
    }
    
    doPlayerHitDetection(groupId, vX, vY){       
        var playerBox = new THREE.Box3().setFromObject(player.objects.mesh);              
        let group = scene.getGroup(groupId);

        let coins = group["coins"];
        let coinCount = coins.length;
        for (let i = 0; i < coinCount; i++){
            let coin = coins[i];   
            if (!coin) {continue;}          
            if (boxIntersectsWithXY(playerBox, coin.userData.box)){
                if (coin.name ==="coin"){
                    sounds.play("coin");
                    player.coinCount +=1;
                    if (player.coinCount >= level.totalCoins){
                        setTimeout(()=> gameState.win(), 3000);
                    }
                }
                else if (coin.name ==="powerup"){
                    sounds.play("powerup");
                    player.powerTimer += 15;
                    
                    let ghouls = scene.root.ghouls;
                    for (let i = 0; i < ghouls.length; i++){
                        let ghoul = ghouls[i];
                        if (!ghoul){
                            continue;
                        }
                        
                        ghoul.material.color = new THREE.Color(1,0,1);
                    }

                }
                scene.remove(coin);
                delete coins[i];
            }
        }

        let portals = group["portals"];
        let portalCount = portals.length;
        for (let i = 0; i < portalCount; i++){
            let portal = portals[i];   
            if (!portal) {continue;}          
            if (portal.userData.timeout <= 0 && boxIntersectsWithXY(playerBox, portal.userData.box)){
                let allPortals = scene.selectAllCollections("portals");
                for (let j = 0; j < allPortals.length; j++){
                    let portal2 = allPortals[j];   
                    if (!portal2) {continue;}          
                    if (portal2.id !== portal.id && portal2.name === portal.name){
                        sounds.play("teleport");
                        portal2.userData.timeout = 2;
                        player.objects.mesh.position.x = portal2.position.x;
                        player.objects.mesh.position.y = portal2.position.y;
                        player.objects.light.position.x = player.objects.mesh.position.x;
                        player.objects.light.position.y = player.objects.mesh.position.y;
                        return false;
                    }
                }
            }
        }

        var walls = [];
        group["walls"].forEach((w)=>{
            if (w){walls.push(w);}
        });
        
        var direction = new THREE.Vector3(vX, vY, 0);
        var ray = new THREE.Raycaster(player.objects.mesh.position.clone(), direction.clone().normalize(), 0, 1); 
        
        var bounds = (.30);
        
        var rayIntersects = ray.intersectObjects(walls, false)
        
        var intersects = rayIntersects.length && rayIntersects[0].distance <= bounds;
        if (intersects){
            var wall = rayIntersects[0].object;
            var c = wall.material.color;
            var r = c.r * .5;
            var g =  c.g * .5;
            var b = c.b * .5;
            if (r < .5 && g < .5 && b < .5){
                sounds.play("destroy");
                let groupWalls = group["walls"];
                for (let i =0; i < groupWalls.length; i++){
                    if (groupWalls[i] && groupWalls[i].id == wall.id){
                        scene.removeInGroup(groupId, "walls", i);
                        break;
                    }
                }
                scene.remove(wall);
            }
            else{
                sounds.play("bump");
                wall.material.color = new THREE.Color(r, g, b);
            }            
            return true;                
        }


        
        return false;
    }
    
    doGhoulHitDetection(ghoul, group, vX, vY){       
        var walls = [];
        group["walls"].forEach((w)=>{
            if (w){walls.push(w);}
        });
        
       
        var direction = new THREE.Vector3(vX, vY, 0);
        var ray = new THREE.Raycaster(ghoul.position.clone(), direction.clone().normalize(), 0, 1); 
        
        var bounds = (.30);
        
        var rayIntersects = ray.intersectObjects(walls, false)
        
        var intersects = rayIntersects.length && rayIntersects[0].distance <= bounds;
        if (intersects){
            return true;                
        }
        return false;
    }
}

module.exports = new Collision();