const {BrowserWindow,app} = require("electron")

function createWindow(){
    return window = new BrowserWindow({
        width:800,
        height:600,
        webPreferences:{
            sandbox:true,
            contextIsolation:true,
            // devTools:false //later on 

        }
    })
    
}

app.on('ready',()=>{
    let window = createWindow()
    // window.loadFile("test/test.html")
    window.loadURL("http://localhost:3000/")//require the http://
})