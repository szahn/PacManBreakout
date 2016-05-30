var viewport = require("./viewport");

function buildRenderer(){
    var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = false;
    renderer.setSize( viewport.size.width, viewport.size.height );
    document.body.appendChild( renderer.domElement );
    return renderer;
}

module.exports = buildRenderer();