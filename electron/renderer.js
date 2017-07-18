'use strict';
const {dialog} = require('electron').remote;
var BigNumber = require('bignumber.js');
const THREE = require("./three.min.js");
const fs = require('fs');
const init = require('./initfn.js');
const readline = require('readline');
const OrbitControls = require("three-orbitcontrols");
const updateSize = require("./updateSizefn.js");
const viewGroup = require("./viewGroupClass.js");
const xS = 721;
const yS = 1313;
const Height = 20;

var views = [
    new viewGroup({
        dataView: document.getElementById("dataView2D"),
        ortho: document.getElementById("viewOrtho"),
        view3D: document.getElementById("view3D")
    }, dialog.showOpenDialog({properties: ['openFile']})[0]),
    

];
updateSize(views);
window.addEventListener( 'resize', onWindowResize, false );
createMatrix(views[0]);

console.log("%cStd Dev:", "font-weight: bold;");
console.log("Standard Deviation of set, taken from 75% points height; rounded to 2 decimal places.\n\n");
console.log("%cMax:", "font-weight: bold;")
console.log("Highest value voxel.\n\n");
console.log("%cStat Max:", "font-weight: bold;");
console.log("Statistical max; given from highest value with less than 1 half standard deviation from previous value.");




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
        vG.center = {x: (tX / vG.total), y: (tY / vG.total)};
        init(vG);
        animate();
    });
}


function onWindowResize() {
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
    }
}
