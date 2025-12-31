const {ipcRenderer,contextBridge} = require('electron')

contextBridge.exposeInMainWorld('electronAPI',{
    export: async (table)=>{
        let fileLocation = await ipcRenderer.invoke(
            'select save location',{table}
        )
        if(fileLocation === 1)return "fail"

        let data = await (await fetch('http://localhost:3000/db/navigation/export/'+table)).text()

        let result = await ipcRenderer.invoke(
            'save file',{fileLocation,data}
        )
        if(result === 1)return "fail"

        return "success";
    }
})
// /** @type {Electron.ExecutionScript} */

// contextBridge.executeInMainWorld({
//     func:() => {
//         console.log("preload loaded");
//         let formbody = new FormData();
//         formbody.append('name','google_cs')
//         formbody.append('password','google_cs')
        
//         fetch('http://localhost:3000/db/login_page/log_in',{
//             method:"POST",
//             body:formbody
//         })
//         .then(v=>v.text())
//         .then(v=>console.log("from preload: ",v))
        
//     },
//     args:[]

// });





