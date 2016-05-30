var Promise = require("bluebird");

class AssetCache{
    constructor(){
        this.jsonLoader = new THREE.JSONLoader();
        this.assets = {};
        this.assetsToLoad = 0;
    }

     loadJsonModel(id, url){
        return new Promise((resolve, reject)=>{
            this.jsonLoader.load(url, (geometry, materials) => {
                this.assetsToLoad -=1;
                this.assets[id] ={
                    geometry: geometry,
                    materials: materials
                };
                resolve();
            }, (e)=>{
                //progress
                console.log(`Loading model ${id} ${e.loaded}/${e.total}`);
            }, ()=>{
                //error
            });
        });
    }
    
     get(id){
        return this.assets[id];
    }

     load(){
        return Promise.all([]);
    }
}

module.exports = new AssetCache();