// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
'use strict';
const fs = require('fs');
const readline = require('readline');

var rl = readline.createInterface({ input: fs.createReadStream("data.txt"), output: process.stdout});

rl.on('line', function(line) {
    document.write(line);
})

