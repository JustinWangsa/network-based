const {BrowserWindow,app,ipcMain,dialog} = require("electron")
const path = require('node:path')
const fs = require('node:fs')
const { callbackify } = require("node:util")

function createWindow(){
    return window = new BrowserWindow({
        width:800,
        height:600,
        webPreferences:{
            sandbox:true,//true
            contextIsolation:true,//true
            nodeIntegration:false,//false
            //TODO devTools:false 
            preload:path.join(__dirname,'preload/file_save.js')
        }
    })
    
    
    
}

app.on('ready',()=>{
    let window = createWindow()
    window.webContents.openDevTools()
    // window.loadFile("test/test.html")
    window.loadURL("http://localhost:3000/")//require the http://
})


ipcMain.handle('select save location',async (e)=>{
    
    try{
        let {canceled,filePath}= await dialog.showSaveDialog({
            buttonLabel:"save",
            title:"select a location to save the file"
        })
        
        if(!filePath||canceled) return 1;
        return filePath;
    } catch(e){
        console.log(e);
        return 1;
    }
    
})

ipcMain.handle('save file', (e,arg)=>{
    let {fileLocation,data} = arg;
    try{
        let file = fs.createWriteStream(fileLocation)
        file.write(data);
        file.close();
        return 0;
    } catch(e){
        return 1;
    }
    

})


