'use strict'
const THREE = require("./three.min.js");
const fs = require('fs');
const readline = require('readline');
const OrbitControls = require("three-orbitcontrols");

var container, stats, controls, camera, scene, renderer, dataMatrix;
const xS = 721;
const yS = 1313;
const Height = 2;
var points;
var maxCount = 0;
var total = 0;

createMatrix();


function createMatrix() {
    dataMatrix = new Array(xS);
    for(var i = 0; i < xS; i++){
        dataMatrix[i] = new Array(yS).fill(0);
    }
    var rl = readline.createInterface({ input: fs.createReadStream("exData.TXT") });
    rl.on('line', function(line) {
        var k = line.split("\t");
        //rl.pause();
        if (k.length >= 6) {
            const x = k[1];
            const y = k[2];
            const luminosity = k[3];
            dataMatrix[x][y] += (luminosity >= 200);
            maxCount = Math.max(dataMatrix[x][y], maxCount);
            var center = 0.5 * maxCount
            total++;
        }
        //setTimeout(rl.resume, 0);
    });
    rl.on('close', () => {
        init();
        animate();
    });
}






function init() {
    camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 5, 3500 );
    
    camera.position.z = 2750;
    const avg = total / (xS * yS);
    scene = new THREE.Scene();

    var particles = 1313 * xS;

    var geometry = new THREE.BufferGeometry();

    var positions = new Float32Array( particles * 3 );
    var colors = new Float32Array( particles * 3 );

    var color = new THREE.Color();

    var n = 1000, n2 = n / 2; // particles spread in the cube

    for ( var x = 0; x < xS; x++) {
        for (var y = 0; y < 1313; y++) {
            var i =3 * ( x * 1313 + y);
            const z = dataMatrix[x][y];
            positions[ i ]     = x - (0.5 * xS);
            positions[ i + 1 ] = y - (0.5 * yS);
            positions[ i + 2 ] = z * Height;

            // colors

            var cr = 0.5 + 0.5 * Math.sin(z/10 + 0.0);
            var cg = 0.5 + 0.5 * Math.sin(z/10 + 2*Math.PI/3);
            var cb = 0.5 + 0.5 * Math.sin(z/10 + 4*Math.PI/3);
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

    var material = new THREE.PointsMaterial( { size: 15, vertexColors: THREE.VertexColors } );

    points = new THREE.Points( geometry, material );
    scene.add( points );

    //

    renderer = new THREE.WebGLRenderer( { antialias: false, alpha: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    controls = new OrbitControls (camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;

    document.body.appendChild( renderer.domElement );

    //

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {


    controls.update();
    renderer.render( scene, camera );

}