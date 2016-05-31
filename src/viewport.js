class Viewport{
    constructor(){
        this.size = this.getSize();
    }
    
    getSize(){
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }
    
    onResizeAutoAdjust(){
        this.size = this.getSize();
        $(window).resize(() => {
            this.size = this.getSize();
            var aspect = this.size.width / this.size.height;
            /*if (camera) {
                camera.aspect = aspect;
                camera.updateProjectionMatrix();
            }
            
            if (renderer) {
                renderer.setSize(this.size.width, this.size.height);
            }
            
            if (hud.camera){
                hud.camera.left = - this.size.width / 2;
                hud.camera.right = this.size.width / 2;
                hud.camera.top = this.size.height / 2;
                hud.camera.bottom = - this.size.height / 2;
                hud.camera.updateProjectionMatrix();
            }*/
                
        });        
    }
    
}

module.exports = new Viewport();