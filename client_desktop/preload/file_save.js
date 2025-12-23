const {ipcRenderer,contextBridge} = require('electron')

/** @type {Electron.ExecutionScript} */

contextBridge.executeInMainWorld({
    func:() => {
        console.log("preload loaded");
        let formbody = new FormData();
        formbody.append('name','google_cs')
        formbody.append('password','google_cs')
        
        fetch('http://localhost:3000/db/login_page/log_in',{
            method:"POST",
            body:formbody
        })
        .then(v=>v.text())
        .then(v=>console.log("from preload: ",v))
        
    },
    args:[]

});




contextBridge.exposeInMainWorld('electronAPI',{
    export_stock: async ()=>{
        let fileLocation = await ipcRenderer.invoke(
            'select save location'
        )

        let data = await (await fetch('http://localhost:3000/db/navigation/export/stock')).text()
        console.log(data);

        let result = await ipcRenderer.invoke(
            'save file',{fileLocation,data}
        )

        console.log("export return:",result)
    }
})

