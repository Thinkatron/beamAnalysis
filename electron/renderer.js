// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
'use strict';
const fs = require('fs');
const readline = require('readline');

var dataMatrix = new Array(721);
for(var i = 0; i <= 720; i++){
    dataMatrix[i] = new Array(1313).fill(0);
}



var rl = readline.createInterface({ input: fs.createReadStream("exData.TXT") });

rl.on('line', function(line) {
    var k = line.split("\t");
    if (k.length >= 6) {
        const x = k[1];
        const y = k[2];
        const luminosity = k[3];
        dataMatrix[x][y] += (luminosity >= 200);
    }
});

rl.on('close', (e) => {
    console.log(dataMatrix);
});



function render() {
    window.requestAnimationFrame(render);


}

