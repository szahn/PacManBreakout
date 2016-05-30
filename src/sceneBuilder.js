var scene = require("./scene");
var textures = require("./textures");
var assetCache = require("./assetCache");

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

class SceneBuilder {    
      
    makeWall(groupId, textureId, x, y, z, color){
        var geometry = new THREE.BoxGeometry(.5, .5, .5);
        var material = new THREE.MeshLambertMaterial( { color: color, map: textures.get(textureId) } );
        var wall = new THREE.Mesh( geometry, material );
        wall.position.set(x, y, z);
        wall.userData.box = new THREE.Box3().setFromObject(wall);
        wall.name = "wall";
        scene.register(wall, "walls", groupId);
    }
    
    makeCoin(groupId, x, y, z, color, isPowerup){
        var geometry = new THREE.TorusGeometry( 10, 4, 14, 24 );
        geometry.scale(.014, .014, .014);
        var material = new THREE.MeshPhongMaterial( { color: color, shading: THREE.SmoothShading, shininess: 80, map: textures.get('gold') } );
        var coin  = new THREE.Mesh( geometry, material );
        coin.name = isPowerup ? "powerup" : "coin";
        coin.position.set(x, y, z);
        coin.userData.box = new THREE.Box3().setFromObject(coin);
        scene.register(coin, "coins", groupId);
    }
    
    makeSphere(name, x, y, z, color){
        var geometry = new THREE.SphereGeometry( .20, 16, 16 );
        var material = new THREE.MeshPhongMaterial( {color: color, shading: THREE.SmoothShading, shininess: 80} );
        var sphere = new THREE.Mesh( geometry, material );
        sphere.position.set(x, y, z);
        sphere.name = name;
        sphere.userData.box = new THREE.Box3().setFromObject(sphere);
        scene.add( sphere );
        return sphere;
    }
    
    makePointLight(x, y, color, size){
        var plight = new THREE.PointLight( color, 2, size);
        plight.position.set( x, y, .5);
        plight.penumbra =.2;
        scene.register( plight );    
        return plight;
    }
    
    makeFloor(name, textureId, offsetX, offsetY, width, height, color){
        var geometry = new THREE.PlaneGeometry(width, height, 12, 12);
        var texture = textures.get(textureId).clone();        
        texture.needsUpdate = true;
        var material = new THREE.MeshLambertMaterial( {color: color, side: THREE.DoubleSide, map: texture} );
        material.map.repeat.set(width * 1.5, height * 1.5);
        material.map.wrapS = THREE.MirroredRepeatWrapping;
        material.map.wrapT = THREE.MirroredRepeatWrapping;
        var floor = new THREE.Mesh( geometry, material );
        floor.position.set(offsetX + (width / 2) - .25,offsetY + (-(height / 2)) + .25, -.25);
        floor.receiveShadow = false;
        floor.userData.box = new THREE.Box3().setFromObject(floor);
        floor.name = name;
        scene.register(floor, 'floors');
        return floor.id;
    }
    
    makePlayer(x, y){    
        return {
            light: this.makePointLight(x, y, 0xffffff, 3),
            mesh: this.makeSphere("player", x, y, 0, 0xffff00) 
        };
    }
    
    makePortal(groupId, id, x, y, z, color){
        var material = new THREE.SpriteMaterial( { map: textures.get('portal'), color: color, fog: true, blending: THREE.NormalBlending } );
        var portal = new THREE.Sprite( material );
        portal.position.set(x, y, z);
        portal.scale.set(.5, .5, .5);
        portal.name = id;
        portal.userData.box = new THREE.Box3().setFromObject(portal);
        portal.userData.timeout = 0;
        scene.register(portal, "portals", groupId);
        this.makePointLight(x, y, color, 1);
        return portal;
    }
    
    makeGoul(x, y, z){
        var ghoul = this.makeSphere("goul", x, y, z, "#ff0000");
        ghoul.userData.direction = -1;
        ghoul.userData.nextDirection = getRandomInt(0, 3);
        ghoul.userData.playerMoveTimer = 0;
        scene.register(ghoul, "ghouls");
        return ghoul;
    }

    makeBot(groupId, x, y){    
        return {
            mesh: this.makeGoul(x, y, 0)
        };
    }
        
}

module.exports = new SceneBuilder();