// const fs = require('node:fs');//blocked by node Integration
// console.log(fs);

// const s2 = require('./script2');//still blocked eventhough its not node
// import * as s2 from './script2';//file not found
import * as s2 from 'D:/tugas/3_1/NetworkApp/Final/Desktop/client_desktop/test/script2.js';

console.log(s2);
console.log("src loaded");
function dostuff(){
    console.log("hello");
}

window.dostuff = dostuff;
// fs.opendirSync('.')
