var unit = "m";
var panels = [];
function coordinate(_x, _y) {
    this.x = _x;
    this.y = _y;
}
function panel(ptArr, pos, xS, yS) {
    this.pointArray = ptArr;
    this.canvas = null;
    this.position = pos;
    this.xSize = xS;
    this.ySize = yS;
}
//mainCanvas = document.querySelector();


function renderPanel(panelObj) {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(panelObj.xSize, panelObj.ySize, 0.1, 2000 );
    var renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } );
    

    renderer.setSize( window.innerWidth, (window.innerHeight) );
    document.body.appendChild( renderer.domElement );
    var cube;
    var geometry = new THREE.BoxGeometry( 100, 100, 0 );
    cube = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe: false, transparent: false, opacity: 0} ) );
    
    var bounds = new THREE.LineSegments( geometry, 0x00ff00);
    if ((i % 2) == 0) {
        cube.position.x = (i - 1) * -100; 
        bounds.position.x = (i - 1) * -100; 
    } else {
        cube.position.x = (i) * 100;
        bounds.position.x = (i) * 100;
    }
    cube.rotation.y = -1;
    bounds.rotation.y = -1;
    scene.add(cube);
    scene.add(bounds);
    camera.position.z = 10;
    //camera.rotate.z = 90;
    //scene.position.y = 2;
    renderer.render(scene, camera);
    panels[panels.length] = renderer.domElement;
}


renderPanel(new panel([]));


var ctx = (document.getElementById("mainCanvas")).getContext("2d");
var animate = function () {
    requestAnimationFrame( animate );
    for(var i = 1; i < panels.length; i++) {
        ctx.drawImage();
    }
};

animate();