const xS = 721;
const yS = 1313;
const Height = 20;
var BigNumber = require('bignumber.js');
const loadingdiv = require('./loadingdiv.js');
const THREE = require("./three.min.js");
const OrbitControls = require("three-orbitcontrols");
function findCol(x) {
    return (-2 / (1 + (Math.pow(Math.E, -1 * Math.abs(x)))))+2;
}
var loadingContainer = new loadingdiv('loading');
function init(vG) {
    var ptCount = 0;
    var pHM = 0;
    var geoMean = new BigNumber(1);
    var particles = yS * xS;
    var zIndexArray = [];
    for ( var x = 0; x < xS; x++) {
        for (var y = 0; y < 1313; y++) {
            if (vG.dataMatrix[x][y] > 0) {
                ptCount++;
                if (zIndexArray[vG.dataMatrix[x][y]] != undefined) {
                    zIndexArray[vG.dataMatrix[x][y]] += 1;
                } else {
                    zIndexArray[vG.dataMatrix[x][y]] = 1
                }
            }
        }
    }
    {
        let cond = true;
        var medianZ = 0;
        let totZ = 0;
        while (cond) {
            if (totZ < ptCount * 0.75) {
                if (zIndexArray[medianZ] != undefined) {
                    totZ += zIndexArray[medianZ];
                }
                medianZ++;
            } else {
                cond = false;
            }
        }
    }
    var avgDistArr = [];
    const avg = medianZ;//vG.total / ptCount;
    var geometry = new THREE.BufferGeometry();
    var geometryCentered = new THREE.BufferGeometry();
    var positions = new Float32Array( particles * 3 );
    var positionsCentered = new Float32Array( particles * 3 );
    var colors = new Float32Array( particles * 3 );
    var color = new THREE.Color();
    var sumDifSqr = 0;
    for ( var x = 0; x < xS; x++) { for (var y = 0; y < 1313; y++) {sumDifSqr += Math.pow((vG.dataMatrix[x][y] - avg), 2)}}; // Summation of absolute deviations squared
    var stDev = Math.sqrt(sumDifSqr/((xS * yS) - 1));
    console.log(avg);
    console.log(stDev);
    var maxArr = [0];
    for ( var x = 0; x < xS; x++) {
        for (var y = 0; y < 1313; y++) {
            var i =3 * ( x * 1313 + y);
            const j = 4 * i / 3;
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
            if (z == avg) {
                avgDistArr[avgDistArr.length] = Math.sqrt(Math.pow(x - vG.center.x, 2) + Math.pow(y - vG.center.y, 2));
            }
            if (maxArr[maxArr.length - 1] < z) {
                maxArr[maxArr.length] = z;
            }

            // colors
            var abDev =  (z - avg)/stDev;
            if (abDev > 0) {
                var cg2 = findCol(10 * abDev);
                var cb2 = findCol(10 * abDev);
                var cr2 = 1;
            } else {
                var cg2 = findCol(10 * abDev);
                var cb2 = 1;
                var cr2 = findCol(10 * abDev);
            }
            var cg = 0.5 + 0.5 * Math.sin(z/4 + 0.0);
            var cb = 0.5 + 0.5 * Math.sin(z/4 + 2*Math.PI/3);
            var cr = 0.5 + 0.5 * Math.sin(z/4 + 4*Math.PI/3);

            vG.orthoDat.data[j] = cr2 * 255;
            vG.orthoDat.data[j + 1] = cg2 * 255;
            vG.orthoDat.data[j + 2] = cb2 * 255;
            vG.orthoDat.data[j + 3] = z!=0?255:0;

            color.setRGB( cr, cg, cb );

            colors[ i ]     = color.r;
            colors[ i + 1 ] = color.g;
            colors[ i + 2 ] = color.b;

        }
    }
    var avgDistTot = 0;
    for(var i = 0; i<avgDistArr.length; i++) {
        avgDistTot += avgDistArr[i];
    }
    console.log(maxArr);
    var statMax = maxArr[Math.floor(maxArr.length * 0.90)];
    var max = maxArr[maxArr.length - 1];
    vG.avgDist = avgDistTot / avgDistArr.length;
    //console.log("Gm: " + geoMean);
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

    //vG.camera2Dy.rotation.z = 3 * Math.PI / 2;

    //view3D
    vG.scene3D.add( points );
    vG.scene3D.add(helper);
    vG.scene3D.add(axis);
    vG.camera3D.lookAt(new THREE.Vector3( 0, 0, 0 ));
    vG.camera3D.position.z =   2750;
    vG.scene3D.rotation.y  =   200 * Math.PI / 180;
    vG.scene3D.rotation.x  =   130 * Math.PI / 180;
    vG.scene3D.rotation.z  =   77.5 * Math.PI / 180;


    //viewOrtho
    vG.ctxOrtho.imageSmoothingEnabled = false;
    vG.ctxOrtho.putImageData(vG.orthoDat, 0, 0)
    vG.circleFn();

    let liStDev = document.createElement("li");
    liStDev.innerHTML = "Std Dev:\t" + Math.round(stDev * 100) / 100;
    vG.dataList.appendChild(liStDev);

    let maxLi = document.createElement("li");
    maxLi.innerHTML = "Max:\t" + Math.round(max * 100) / 100;
    vG.dataList.appendChild(maxLi);

    let statMaxLi = document.createElement("li");
    statMaxLi.innerHTML = "Stat Max:\t" + Math.round(statMax * 100) / 100;
    vG.dataList.appendChild(statMaxLi);


    
    vG.controls.enableDamping = false;
    //vG.controls.dampingFactor = 0.25;
    vG.controls.enableZoom = true;

    loadingContainer.stop();
}


module.exports = init;