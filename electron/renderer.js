'use strict';
const THREE = require("./three.min.js");
const fs = require('fs');
const readline = require('readline');
const OrbitControls = require("three-orbitcontrols");
const viewCrossY = document.getElementById("viewCrossY");
var views = [
    new viewGroup(document.getElementById("viewCrossY"))

];
updateSize(views);

const file = "../exFiles/139_alpha0p5mmhole.txt";
//const file = "exData.TXT";
const xS = 721;
const yS = 1313;
const Height = 20;

createMatrix(views[0]);

const loadingdiv = require('./loadingdiv.js');

var loadingContainer = new loadingdiv('loading');

function findCol(x) {
    return (-2 / (1 + (Math.pow(Math.E, -1 * Math.abs(x)))))+2;
}

function viewGroup(element) {
    this.elem = element;
    this.renderer = null;
    this.camera = null;
    this.scene = null;
    this.dataMatrix = null;
    this.total = 0;
    this.maxCount = 0;
}

function createMatrix(vG) {
    vG.dataMatrix = new Array(xS);
    for(var i = 0; i < xS; i++){
        vG.dataMatrix[i] = new Array(yS).fill(0);
    }
    var rl = readline.createInterface({ input: fs.createReadStream(file) });
    rl.on('line', function(line) {
        var k = line.split("\t");
        //rl.pause();
        if (k.length >= 6) {
            const x = k[1];
            const y = k[2];
            const luminosity = k[3];
            vG.dataMatrix[x][y] += (luminosity >= 200);
            vG.maxCount = Math.max(vG.dataMatrix[x][y], vG.maxCount);
            var center = 0.5 * vG.maxCount;
            vG.total++;
        }
        //setTimeout(rl.resume, 0);
    });
    rl.on('close', () => {
        init(vG);
        animate();
    });
}

function updateSize(vGL) {
    for(var i = 0; i < vGL.length; i++) {
        vGL[i].elem.width  = vGL[i].elem.clientWidth;
        vGL[i].elem.height = vGL[i].elem.clientHeight;
        try {
            vGL[i].camera.aspect = vGL[i].elem.clientWidth / vGL[i].elem.clientHeight;
            vGL[i].camera.updateProjectionMatrix();
        } catch (e) {
            console.log(e + "\n\n\tYou're likely okay, camera probably just isnt instanciated yet.")
        }
    }
}




function init(vG) {

    vG.camera = new THREE.PerspectiveCamera( 40, viewCrossY.clientWidth / viewCrossY.clientHeight, 5, 3500 );

    vG.camera.position.z = 2750;
    const avg = vG.total / (xS * yS);
    vG.scene = new THREE.Scene();

    var particles = yS * xS;

    var geometry = new THREE.BufferGeometry();

    var positions = new Float32Array( particles * 3 );
    var colors = new Float32Array( particles * 3 );

    var color = new THREE.Color();

    var sumDifSqr = 0;
    for ( var x = 0; x < xS; x++) { for (var y = 0; y < 1313; y++) {sumDifSqr += Math.pow((vG.dataMatrix[x][y] - avg), 2)}}; // Summation of absolute deviations squared
    var stDev = Math.sqrt(sumDifSqr/((xS * yS) - 1));
    for ( var x = 0; x < xS; x++) {
        for (var y = 0; y < 1313; y++) {
            var i =3 * ( x * 1313 + y);
            const z = vG.dataMatrix[x][y];
            positions[ i ]     = x - (0.5 * xS);
            positions[ i + 1 ] = y - (0.5 * yS);
            positions[ i + 2 ] = z * Height;

            // colors
            /*
            var abDev =  (z - avg)/stDev;
            if (abDev > 0) {
                var cg = findCol(abDev);
                var cb = findCol(abDev);
                var cr = 1;
            } else {
                var cg = findCol(4 * abDev);
                var cb = 1;
                var cr = findCol(4 * abDev);
            }
            */

            //*
            var cg = 0.5 + 0.5 * Math.sin(z/4 + 0.0);
            var cb = 0.5 + 0.5 * Math.sin(z/4 + 2*Math.PI/3);
            var cr = 0.5 + 0.5 * Math.sin(z/4 + 4*Math.PI/3);
            //*/
            color.setRGB( cr, cg, cb );

            colors[ i ]     = color.r;
            colors[ i + 1 ] = color.g;
            colors[ i + 2 ] = color.b;

        }
    }


    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

    geometry.computeBoundingSphere();

    //
    var helper = new THREE.GridHelper(2000, 40);
    helper.rotation.x = Math.PI / 2;
    vG.scene.add(helper)
    var material = new THREE.MeshBasicMaterial( { /*size: 15, */vertexColors: THREE.VertexColors } );

    var points = new THREE.Mesh( geometry, material );
    vG.scene.add( points );

    //
    vG.scene.rotation.y = Math.PI / 2.0;
    vG.camera.rotation.z = 3 * Math.PI / 2;
    vG.renderer = new THREE.WebGLRenderer( {canvas: viewCrossY, antialias: true, alpha: true} );
    vG.renderer.setPixelRatio( window.devicePixelRatio );
    vG.renderer.setViewport(0, 0,  vG.elem.clientWidth, vG.elem.clientHeight );
    vG.renderer = new THREE.WebGLRenderer( {canvas: vG.elem, antialias: true, alpha: true} );
    vG.renderer.setPixelRatio( window.devicePixelRatio );
    vG.renderer.setViewport(0, 0,  vG.elem.clientWidth, vG.elem.clientHeight );
    //controls = new OrbitControls (camera, renderer.domElement);
    //controls.enableDamping = true;
    //controls.dampingFactor = 0.25;
    //controls.enableZoom = true;

    loadingContainer.stop();
    document.body.appendChild( vG.renderer.domElement );

    //

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    updateSize(views);

    vG.renderer.setViewport(0, 0, vG.elem.clientWidth, vG.elem.clientHeight );

}

//

function animate() {

    requestAnimationFrame( animate );

    render(views);

}

function render(vGL) {


    for(var i = 0; i < vGL.length; i++) {
        vGL[i].renderer.render( vGL[i].scene, vGL[i].camera );
    }
}
