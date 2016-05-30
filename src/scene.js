class Scene extends THREE.Scene{
    constructor(){
        super();
        this.root = {
            floors: [],
            ghouls: []
        }
        
        this.groups = {};
    }    
    
    reset(){
        while (this.children.length){
            this.remove(this.children.pop());
        }
        
        this.root = {
            floors: [],
            ghouls: []
        }
        
        this.groups = {};        
        
        this.add(new THREE.AmbientLight(0x444444, .2));     
    }
    
    getEmptyGroup(){
        return {
            walls: [],
            coins: [],
            portals: []
        };
    }
    
    createOrGetGroup(groupId){
        if (!this.groups[groupId]){
            this.groups[groupId] = this.getEmptyGroup();
        }
        return this.groups[groupId];
    }
    
    getCollidableObjects(groupId){
        let g = this.groups[groupId];
        return [].concat(g.walls, g.coins, g.gouls);
    }

    register(object, collectionId, groupId){
        this.add(object);
        if (collectionId){
            if (typeof groupId !== "undefined"){
                this.createOrGetGroup(groupId)[collectionId].push(object);            
            }
            else{
                this.root[collectionId].push(object);
            }
        }
    }    
    
    removeInGroup(groupId, collectionId, index){
        delete this.groups[groupId][collectionId][index];
    }
    
    getGroup(groupId){
        return this.groups[groupId];        
    }
    
    selectAllCollections(collectionId){
        let items = [];
        for (let gId of Object.keys(this.groups)){
            items = items.concat(this.groups[gId][collectionId]);
        }
        return items;
    }
    
    getCollection(collectionId){       
        return this.root[collectionId];
    }
    
    removeFromCollection(obj, collectionId, groupId){
        let items = this.groups[groupId][collectionId];
        items.forEach((item, idx)=>{
            if (item.id === obj.id){
                items.splice(idx, 1);
                this.remove(obj);
            }       
        });
    }    
    
}

module.exports = new Scene();