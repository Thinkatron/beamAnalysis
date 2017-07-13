'use strict';
const {dialog} = require('electron').remote
var BigNumber = require('bignumber.js');
const THREE = require("./three.min.js");
const fs = require('fs');
const loadingdiv = require('./loadingdiv.js');
const readline = require('readline');
const OrbitControls = require("three-orbitcontrols");
const viewCrossY = document.getElementById("viewCrossY");



var views = [
    new viewGroup({
        y: document.getElementById("view2Dy"),
        x: document.getElementById("view2Dx"),
        ortho: document.getElementById("viewOrtho"),
        view3D: document.getElementById("view3D")
    }, dialog.showOpenDialog({properties: ['openFile']})[0]),
    

];
updateSize(views);

//const file = "exData.TXT";
const xS = 721;
const yS = 1313;
const Height = 20;
window.addEventListener( 'resize', onWindowResize, false );
createMatrix(views[0]);

function findCol(x) {
    return (-2 / (1 + (Math.pow(Math.E, -1 * Math.abs(x)))))+2;
}

function viewGroup(elements, file) {
    this.center = null;
    this.view2Dx = elements.x;
    this.view2Dy = elements.y;
    this.viewOrtho = elements.ortho;
    this.view3D = elements.view3D;
    this.file = file;
    this.ctxOrtho = this.viewOrtho.getContext("2d", {alpha: true});
    this.renderer2Dx = new THREE.WebGLRenderer( {canvas: this.view2Dx, antialias: true, alpha: true} );
    this.camera2Dx = new THREE.PerspectiveCamera( 40, this.view2Dx.clientWidth / this.view2Dx.clientHeight, 5, 4000 );
    this.scene2Dx = new THREE.Scene();
    this.renderer2Dy = new THREE.WebGLRenderer( {canvas: this.view2Dy, antialias: true, alpha: true} );
    this.camera2Dy = new THREE.PerspectiveCamera( 25, this.view2Dy.clientWidth / this.view2Dy.clientHeight, 5, 4000 );
    this.scene2Dy = new THREE.Scene();
    this.renderer3D = new THREE.WebGLRenderer( {canvas: this.view3D, antialias: true, alpha: true} );
    this.camera3D = new THREE.PerspectiveCamera( 40, this.view3D.clientWidth / this.view3D.clientHeight, 5, 4000 );
    this.scene3D = new THREE.Scene();
    this.controls = new OrbitControls(this.camera3D, this.view3D);
    this.dataMatrix = null;
    this.total = 0;
    this.maxCount = 0;
}

    var loadingContainer = new loadingdiv('loading');
function createMatrix(vG) {
    var tX = new BigNumber(0);
    var tY = new BigNumber(0);
    vG.dataMatrix = new Array(xS);
    for(var i = 0; i < xS; i++){
        vG.dataMatrix[i] = new Array(yS).fill(0);
    }
    var rl = readline.createInterface({ input: fs.createReadStream(vG.file) });
    rl.on('line', function(line) {
        var k = line.split("\t");
        //rl.pause();
        if (k.length >= 6) {
            const x = k[1];
            const y = k[2];
            const luminosity = k[3];
            vG.dataMatrix[x][y] += (luminosity >= 200);
            vG.maxCount = Math.max(vG.dataMatrix[x][y], vG.maxCount);
            tX = tX.plus(x);
            tY = tY.plus(y);
            vG.total++;
        }
        //setTimeout(rl.resume, 0);
    });
    rl.on('close', () => {
        vG.center = {x: (tX / vG.total), y: (tY / vG.total)}
        console.log(vG.center.x + " " + vG.center.y);
        init(vG);
        animate();
    });
}

function updateSize(vGL) {
    for(var i = 0; i < vGL.length; i++) {
        vGL[i].view2Dx.width  = window.innerWidth / 4 - 2;
        vGL[i].view2Dx.height = window.innerHeight / 4 - 2;
        vGL[i].view2Dy.width  = window.innerWidth / 4 - 2;
        vGL[i].view2Dy.height = window.innerHeight / 4 - 2;
        vGL[i].view3D.width  = window.innerWidth / 2 - 2;
        vGL[i].view3D.height = 3 * window.innerHeight / 4 - 2;
        vGL[i].viewOrtho.width  = window.innerWidth / 2 - 2;
        vGL[i].viewOrtho.height = window.innerHeight / 2 - 2;
        vGL[i].view2Dx.style.width = vGL[i].view2Dx.width;
        vGL[i].view2Dx.style.height = vGL[i].view2Dx.height;
        vGL[i].view2Dy.style.width = vGL[i].view2Dy.width;
        vGL[i].view2Dy.style.height = vGL[i].view2Dy.height;
        vGL[i].view3D.style.width = vGL[i].view3D.width;
        vGL[i].view3D.style.height = vGL[i].view3D.height;
        vGL[i].viewOrtho.style.maxWidth = vGL[i].viewOrtho.width;
        vGL[i].viewOrtho.style.maxHeight = vGL[i].viewOrtho.height;
        vGL[i].camera2Dx.aspect = vGL[i].view2Dx.width / vGL[i].view2Dx.height;
        vGL[i].camera2Dy.aspect = vGL[i].view2Dy.width / vGL[i].view2Dy.height;
        vGL[i].camera3D.aspect = vGL[i].view3D.width / vGL[i].view3D.height;
        
        vGL[i].renderer2Dx.setSize(vGL[i].view2Dx.width, vGL[i].view2Dx.height );
        vGL[i].renderer2Dy.setSize(vGL[i].view2Dy.width, vGL[i].view2Dy.height );
        vGL[i].renderer3D.setSize(vGL[i].view3D.width, vGL[i].view3D.height );
        
        vGL[i].renderer2Dx.setViewport(0, 0, vGL[i].view2Dx.width, vGL[i].view2Dx.height );
        vGL[i].renderer2Dy.setViewport(0, 0, vGL[i].view2Dy.width, vGL[i].view2Dy.height );
        vGL[i].renderer3D.setViewport(0, 0, vGL[i].view3D.width, vGL[i].view3D.height );


        vGL[i].camera3D.updateProjectionMatrix();
        vGL[i].camera2Dy.updateProjectionMatrix();
        vGL[i].camera2Dx.updateProjectionMatrix();

    }
}




function init(vG) {


    const avg = vG.total / (xS * yS);

    var particles = yS * xS;

    var geometry = new THREE.BufferGeometry();
    var geometryCentered = new THREE.BufferGeometry();

    var positions = new Float32Array( particles * 3 );
    var positionsCentered = new Float32Array( particles * 3 );
    var colors = new Float32Array( particles * 3 );

    var color = new THREE.Color();

    var sumDifSqr = 0;
    for ( var x = 0; x < xS; x++) { for (var y = 0; y < 1313; y++) {sumDifSqr += Math.pow((vG.dataMatrix[x][y] - avg), 2)}}; // Summation of absolute deviations squared
    var stDev = Math.sqrt(sumDifSqr/((xS * yS) - 1));
    for ( var x = 0; x < xS; x++) {
        for (var y = 0; y < 1313; y++) {
            var i =3 * ( x * 1313 + y);
            const z = vG.dataMatrix[x][y];
            if (z != 0) {
                positionsCentered[ i ]     = x - (0.5 * xS);
                positionsCentered[ i + 1 ] = y - (0.5 * yS);
                positionsCentered[ i + 2 ] = (z - 0.5 * vG.maxCount) * Height;
                positions[ i ]     = x - vG.center.x;
                positions[ i + 1 ] = y - vG.center.y;
                positions[ i + 2 ] = z * Height;
                var cg = 0.5 + 0.5 * Math.sin(z/4 + 0.0);
                var cb = 0.5 + 0.5 * Math.sin(z/4 + 2*Math.PI/3);
                var cr = 0.5 + 0.5 * Math.sin(z/4 + 4*Math.PI/3);
            } else {
                positionsCentered[ i ]     = 0;
                positionsCentered[ i + 1 ] = 0;
                positionsCentered[ i + 2 ] = (0 - 0.5 * vG.maxCount) * Height;
                positions[ i ]     = 0;
                positions[ i + 1 ] = 0;
                positions[ i + 2 ] = 0;
                var cg = 0.137;
                var cb = 0.137;
                var cr = 0.137;
            }
            // colors

            var abDev =  (z - avg)/stDev;
            if (abDev > 0) {
                var cg2 = findCol(abDev);
                var cb2 = findCol(abDev);
                var cr2 = 1;
            } else {
                var cg2 = findCol(4 * abDev);
                var cb2 = 1;
                var cr2 = findCol(4 * abDev);
            }



            var cg = 0.5 + 0.5 * Math.sin(z/4 + 0.0);
            var cb = 0.5 + 0.5 * Math.sin(z/4 + 2*Math.PI/3);
            var cr = 0.5 + 0.5 * Math.sin(z/4 + 4*Math.PI/3);

            color.setRGB( cr, cg, cb );

            colors[ i ]     = color.r;
            colors[ i + 1 ] = color.g;
            colors[ i + 2 ] = color.b;

        }
    }


    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
    geometry.computeBoundingSphere();

    geometryCentered.addAttribute( 'position', new THREE.BufferAttribute( positionsCentered, 3 ) );
    geometryCentered.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
    geometryCentered.computeBoundingSphere();

    //
    var helper = new THREE.GridHelper(2000, 40, 0xFFFFFF);
    var axis = new THREE.AxisHelper(2000);
    var ptMaterial = new THREE.PointsMaterial( {size: 15, vertexColors: THREE.VertexColors} );
    var points = new THREE.Points( geometry, ptMaterial );
    var meshMaterial = new THREE.PointsMaterial( {size: 30, vertexColors: THREE.VertexColors} );
    var mesh = new THREE.Points( geometryCentered, meshMaterial );

    helper.rotation.x = Math.PI / 2;
    helper.position.z = -1;
    //view2Dx
    vG.scene2Dx.add( mesh );
    vG.scene2Dx.add(helper);
    vG.camera2Dx.position.z = 2750;
    vG.camera2Dx.lookAt(new THREE.Vector3( 0, 0, 0 ));
    vG.scene2Dx.rotation.y = Math.PI / 2.0;
    //vG.camera2Dx.rotation.z = 3 * Math.PI / 2;

    //view2Dy
    vG.scene2Dy.add( mesh );
    vG.scene2Dy.add(helper);
    vG.camera2Dy.position.z = 2750;
    vG.camera2Dy.lookAt(new THREE.Vector3( 0, 0, 0 ));;
    //vG.camera2Dy.rotation.z = 3 * Math.PI / 2;

    //view3D
    vG.scene3D.add( points );
    vG.scene3D.add(helper);
    vG.scene3D.add(axis);
    vG.camera3D.lookAt(new THREE.Vector3( 0, 0, 0 ));
    vG.camera3D.position.z = 2750;
    vG.scene3D.rotation.y =   200 * Math.PI / 180;
    vG.scene3D.rotation.x =   130 * Math.PI / 180;
    vG.scene3D.rotation.z =   77.5 * Math.PI / 180;



    vG.controls.enableDamping = true;
    vG.controls.dampingFactor = 0.25;
    vG.controls.enableZoom = true;

    loadingContainer.stop();
}

function onWindowResize() {
    console.log("resizing");
    updateSize(views);
}

//

function animate() {
    requestAnimationFrame( animate );
    render(views);
}

function render(vGL) {
    for(var i = 0; i < vGL.length; i++) {
        vGL[i].controls.update();
        vGL[i].renderer3D.render( vGL[i].scene3D, vGL[i].camera3D );
        vGL[i].renderer2Dx.render( vGL[i].scene2Dx, vGL[i].camera2Dx );
        vGL[i].renderer2Dy.render( vGL[i].scene2Dy, vGL[i].camera2Dy );
    }
}
