// const fs=require('fs');//blocked by sandbox
// console.log("preload loaded",fs);
const {contextBridge} = require('electron')




console.log("preload loaded");
function dostuff2(){
    console.log("hello 2");
}
function dostuff3(){
    console.log("do stuff 3");
    dostuff2();
}

contextBridge.exposeInMainWorld('api',{
    dostuff2,
})

// window.dostuff2 = dostuff2;//blocked by context isolation
// window.dostuff3 = dostuff3;//blocked by context isolation