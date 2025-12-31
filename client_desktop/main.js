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
    // window.webContents.openDevTools()
    // window.loadFile("test/test.html")
    window.loadURL("http://localhost:3000/")//require the http://
})


ipcMain.handle('select save location',async (e,arg)=>{
    let time = new Date();
    let timeStr = 
        time.getFullYear().toString().padStart(4,'0')
        + (time.getMonth()+1).toString().padStart(2,'0')
        + time.getDate().toString().padStart(2,'0')
        + time.getHours().toString().padStart(2,'0')
        + time.getMinutes().toString().padStart(2,'0')
        + time.getSeconds().toString().padStart(2,'0')
    
    try{
        let {canceled,filePath}= await dialog.showSaveDialog({
            buttonLabel:"save",
            title:"select a location to save the file",
            defaultPath:app.getPath('downloads')
                +'/'
                + arg.table
                +'_'
                + timeStr
                +'.csv'
            
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
        console.log(e);
        return 1;
    }
    

})


