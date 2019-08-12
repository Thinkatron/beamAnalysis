// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
'use strict';
const fs = require('fs');
const readline = require('readline');
const THREE = require("three");
const OrbitControls = require("three-orbitcontrols");
var instances;
var maxCount = 0;
var renderGroups = [];
var first = true;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(27, Document.innerWidth/Document.innerHeight, 5, 3500 );
camera.position.z = 2750;
camera.rotateZ = 45;
var renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } )
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
//renderer.setPixelRatio( window.devicePixelRatio );

//var particles = 1313 * 721;
//var positions = new Float32Array( particles * 3 );
//var colors = new Float32Array( particles * 3 );
//colors.fill(0);
//positions.fill(0);
//var geometry = new THREE.BufferGeometry();
var color = new THREE.Color();
var dataMatrix = new Array(721);
for(var i = 0; i <= 720; i++){
    dataMatrix[i] = new Array(1313).fill(0);
}
//var material = new THREE.PointsMaterial( { size: 15, vertexColors: THREE.VertexColors, opacity: true } );
//var material = new THREE.LineBasicMaterial( { color: 0x00ff00 } )
//geometry.setDrawRange( 0, particles );
//var points = new THREE.LineSegments( geometry, material );
//scene.add(points);
var gridHelper = new THREE.GridHelper( 2000, 4, 0xff0000, 0x00ff00 );
scene.add( gridHelper );
//var rl = readline.createInterface({ input: fs.createReadStream("exData.TXT") });
var controls = new OrbitControls (camera, renderer.domElement);
//geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
//geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
controls.enableDamping = true
controls.dampingFactor = 0.25
controls.enableZoom = false
//scene.add(points);
renderLoop();
/*rl.on('line', function(line) {
    rl.pause();
    if (first = true) {
        for(var i = 0; i <= 720; i++){
            dataMatrix[i] = new Array(1313).fill(0);
        }
        first = false;
    }
    var k = line.split("\t");
    if (k.length >= 6) {
        const x = k[1];
        const y = k[2];
        const luminosity = k[3];
        dataMatrix[x][y] += (luminosity >= 200);
        maxCount = Math.max(dataMatrix[x][y], maxCount);
        var i = x * 1313 + y;
        positions[i] = x;
        positions[i + 1] = y;
        positions[i + 2] = dataMatrix[x][y] * 4;
        var center = 0.5 * maxCount
        if (dataMatrix[x][y] < 0.5 * maxCount) {
            var cr = 255 * (center - dataMatrix[x][y]) / center;
            var cg = 255 * (center - dataMatrix[x][y]) / center;
            var cb = 255;
        } else {
            var cr = 255;
            var cg = 255 * (dataMatrix[x][y] - center) / center;
            var cb = 255 * (dataMatrix[x][y] - center) / center;
        }

        process.stdout.write("Color:\tr: " + cr + "\tg: " + cg + "\tb" + cb + "\n");
        color.setRGB( cr, cg, cb );
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
        geometry.computeBoundingSphere();
        geometry.computeVertexNormals();
        geometry.attributes.color.needsUpdate = true;
        geometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
    }
    setTimeout(rl.resume, 10);
});

rl.on('close', (e) => {
    first = true;
    console.log(maxCountX, ' ', maxCountY);
    console.log(maxCount);
    console.log(dataMatrix);
});*/


function renderLoop() {
    controls.update();
    window.requestAnimationFrame(renderLoop);
    renderer.render(scene, camera);
}