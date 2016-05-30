"use strict";
var Promise = require("bluebird");
class Sounds{
    
    constructor(){
        this.soundsToLoad = 7;
        this.sounds = {};
    }
    
    loadMusic(id, url){
        let audio = this.sounds[id] = new Audio();
        audio.autoplay = "autoplay";
        audio.loop = "loop";
        return new Promise((resolve, reject)=>{
            audio.oncanplaythrough = (e)=>{
                this.soundsToLoad -=1;
                audio.oncanplaythrough = null;
                resolve();
            };
            
            audio.onerror = (e)=>{
                reject();
            };                        
            
            audio.src =url;
        });
    }
    
    loadAudio(id, url){        
        let audio = this.sounds[id] = new Audio();
        return new Promise((resolve, reject)=>{
            audio.oncanplaythrough = (e)=>{
                this.soundsToLoad -=1;
                audio.oncanplaythrough = null;
                resolve();
            };
            
            audio.onerror = (e)=>{
                reject();
            };                        
            
            audio.src =url;
        });
    }
    
    play(id){
        let snd = this.sounds[id];
        if (!snd){
            return;
        }
        snd.play();
    }    
    
    load(){
        return Promise.all([this.loadAudio("bump", "assets/bump.mp3"),
            this.loadAudio("coin", "assets/coin.mp3"),
            this.loadAudio("hit", "assets/hit.mp3"),
            this.loadAudio("powerup", "assets/powerup.mp3"),
            this.loadAudio("destroy", "assets/destroy.mp3"),
            this.loadAudio("hurt", "assets/hurt.mp3"),
            this.loadAudio("teleport", "assets/teleport.mp3"),
            this.loadMusic("loop", "assets/loop.mp3")]);
    }
    
}

module.exports = new Sounds();