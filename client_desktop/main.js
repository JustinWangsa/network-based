const {BrowserWindow,app} = require("electron")
const path = require('node:path')

function createWindow(){
    return window = new BrowserWindow({
        width:800,
        height:600,
        webPreferences:{
            sandbox:true,//true
            contextIsolation:true,//true
            nodeIntegration:false,//false
            // devTools:false //later on 
            preload:path.join(__dirname,'preload/script.js')
        }
    })
    
    
    
}

app.on('ready',()=>{
    let window = createWindow()
    window.webContents.openDevTools()
    window.loadFile("test/test.html")
    // window.loadURL("http://localhost:3000/")//require the http://
})