var sceneBuilder = require("./sceneBuilder");
var scene = require("./scene");
var player = require("./player");
var camera = require("./camera");
var Promise = require("bluebird");

class Level{
    
    constructor(){
        this.reset();
    }
    
    reset(){
        this.totalCoins = 0;
    }
    
    makeLevel(levelUrl){
        scene.reset();
        var portalColors = ["#00f", "#f0f", "#0f0"]
        return new Promise((resolve, reject)=>{
            $.get(levelUrl, (data)=>{
                var connectors = {};
                
                data.rooms.forEach((room)=>{
                    var map = {
                        name: room.name,
                        cells:room.cells,
                        height: room.cells.length,
                        width: room.cells[0].length,
                        floorColor: room.floor[1],
                        floorTexture: room.floor[0],
                        wallColor: room.walls[1],
                        wallTexture: room.walls[0] 
                    }
                    
                    var offsetX = 0;
                    var offsetY = 0;
                    
                    if (room.offset && room.link){
                        offsetX = connectors[room.link].x + (room.offset[0] * .5);
                        offsetY = connectors[room.link].y + (-room.offset[1] * .5);
                    }
                    
                    let floorId = sceneBuilder.makeFloor(map.name, map.floorTexture, offsetX, offsetY, map.width * .5, map.height * .5, map.floorColor);    
                    
                    for (var y = 0; y < map.height; y++){
                        var row = map.cells[y];
                        for (var x = 0; x < map.width; x++){
                            var sceneX = offsetX + (x * .5);
                            var sceneY = offsetY + -(y * .5);
                            var cellId = row[x];
                            if (cellId == 1){
                                sceneBuilder.makeWall(floorId, map.wallTexture, sceneX, sceneY, 0,  map.wallColor);
                            }
                            else if (cellId == 9){
                                this.totalCoins += 1;
                                sceneBuilder.makeCoin(floorId, sceneX, sceneY, 0, "#ffbf00");
                            }
                            else if (cellId[0] == "t"){
                                var portalIndex = parseInt(cellId[1], 10);
                                sceneBuilder.makePortal(floorId, cellId, sceneX, sceneY, .12, portalColors[portalIndex]);
                            }
                            else if (cellId == 2){
                                sceneBuilder.makeCoin(floorId, sceneX, sceneY, 0, 0xff00ff, true);
                            }
                            else if (cellId == 3){
                                sceneBuilder.makeBot(floorId, sceneX, sceneY);
                            }
                            else if (cellId === "p"){
                                player.objects = sceneBuilder.makePlayer(sceneX, sceneY);
                            }
                            else{
                                connectors[cellId] = {
                                    x: sceneX,
                                    y: sceneY
                                }
                            }
                        }
                    }
                    
                });
                
                resolve();
            }, "json");    
        });
    }    
}

module.exports = new Level();