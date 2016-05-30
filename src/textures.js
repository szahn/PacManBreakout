var Promise = require("bluebird");

class Textures{
    
    constructor(){
        this.textures = {};
        this.loader = new THREE.TextureLoader();
        this.texturesToLoad = 8;
    }
    
    get(id){
        return this.textures[id];
    }
    
    loadTexture(id, filename){
        return new Promise((resolve, reject)=>{
            this.loader.load(filename, (texture)=>{
                //load
                console.log("Loaded texture", id)
                texture.minFilter = THREE.NearestFilter;
                texture.maxFilter = THREE.NearestFilter;
                this.textures[id] = texture;
                resolve();
                this.texturesToLoad -=1;
            }, (e)=>{
                //progress            
                console.log(`Loading texture ${id} ${e.loaded}/${e.total}`);
            }, ()=>{
                //error
                reject();
            });
        });
    }
    
    load(){
        return Promise.all([this.loadTexture("floor0", "assets/floor0.png"),
            this.loadTexture("floor1", "assets/floor1.png"),
            this.loadTexture("wall0", "assets/wall0.png"),
            this.loadTexture("wall1", "assets/wall1.png"),
            this.loadTexture("wall2", "assets/wall2.png"),
            this.loadTexture("wall3", "assets/wall3.jpg"),
            this.loadTexture("wall4", "assets/wall4.png"),
            this.loadTexture("portal", "assets/portal.png")]);
    }
    
}

module.exports = new Textures();