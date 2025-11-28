const sql = require('mysql')
const con = sql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
})

function query(command){
    return new Promise((res,rej)=>{
        con.query(command,(err,result)=>{
            if(err) rej(err)
            else res(result)
        })
    })
} 

// query("create database if not exists mydb"). then((res)=>console.log(res))
// query("show databases"). then((res)=>console.log(res))
// query("drop database mydb"). then((res)=>console.log(res))
// query("show databases"). then((res)=>console.log(res))

(async function hh(){
    query("Select Database()"). then((res)=>console.log(res))
    query("use test_db"). then((res)=>console.log(res))
    query("Select Database()"). then((res)=>console.log(res))
    query("use test_db"). then((res)=>console.log(res))
    query("Select Database()"). then((res)=>console.log(res))
    con.end()
})()



//a connection for each database ?


// con.query("show databases",(err,result)=>{
    // con.end(()=>{console.log("connection end");}) //this is optional
//     console.log("done");
//     if(err) console.log(err);
//     else console.log(result);
// })

// con.end(()=>{console.log("connection end");})


