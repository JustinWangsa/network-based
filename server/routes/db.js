const {Router} = require('express')
const router = Router();
const {inspect} = require('util');

const sql = require('mysql')
const con = sql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"test_db"
})

function query(command){
    return new Promise((res,rej)=>{
        con.query(command,(err,result)=>{
            if(err) rej(err)
            else res(result)
        })
    })
} 

/* 
only one database, I dont want some nightmarish maintenence
*/



/*  */router.get("/debug",(req,res)=>{
    query("show databases")
        .then((result)=>res.end(inspect(result)))
        .catch((err)=>console.log(err))
})

router.post("/login_page/submission",(req,res)=>{
    
})
router.get("/login_page/sign_up",(req,res)=>{})

router.get("/transaction_page/cart_page",(req,res)=>{})
router.get("/transaction_page/post_transaction",(req,res)=>{})
router.get("/transaction_page/fetch_transaction_history",(req,res)=>{})

router.get("/navigation/export",(req,res)=>{})

router.get("/stock_page/update_stock",(req,res)=>{})
router.get("/stock_page/update_limitation",(req,res)=>{})

router.get("/summary_page/high_level",(req,res)=>{})
router.get("/summary_page/log",(req,res)=>{})

module.exports = router


// /general/log_out(client side)


// /login_page
//     /login_page/submission (server convert password into hash)
//     /login_page/sign_up 
// /transaction_page
//     /transaction_page/cart_page
//     /transaction_page/post_transaction
//     /transaction_page/fetch_transaction_history
// /navigation(manager client side)
//     /navigation/export(electron client exclusive)
// /stock_page
//     /stock_page/update_stock
//     /stock_page/update_limitation
// /summary_page
//     /summary_page/high_level
//     /summary_page/log