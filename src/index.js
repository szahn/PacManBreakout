"use strict";
var GameInput = require("./gameInput");
var scene = require("./scene");
var camera = require("./camera");
var renderer = require("./renderer");
var gameLoop = require("./gameLoop");
var sceneBuilder = require("./sceneBuilder");
var textures = require("./textures");
var player = require("./player");
var level = require("./level");
var gamepad = require("./gamepad");
var assetCache = require("./assetCache");
var Promise = require("bluebird");
var viewport = require("./viewport");
var hud  = require("./hud");
var sounds = require("./sounds");
var gameState = require("./gameState");

viewport.onResizeAutoAdjust();
hud.init();
hud.draw();

Promise.all([textures.load(), assetCache.load(), sounds.load()]).then(()=>{
    var alight = new THREE.AmbientLight(0x555555, .25);
    scene.add( alight );     
    level.makeLevel("assets/level1.json").then(()=>{
        GameInput.listen($(window));
        gamepad.listen();
        gameState.showHelp();
        gameLoop.render(); 
    });
});


 
// Stop moving around when the window is unfocused (keeps my sanity!)
$(window).focus(function() {
    if (gameState.state === 4){
        gameState.state = 1;
    }
}).blur(function() {
    if (gameState.state === 1){
        gameState.state = 4;
    }
});