const {Router} = require('express')
const router = Router();

const mysql = require('mysql')
const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root"
});

/* 
user will also send their database/id s.t. server know which database to use

*/

router.get("/login_page/submission",(req,res)=>{})
router.get("/login_page/sign_up",(req,res)=>{})

router.get("/transaction_page/cart_page",(req,res)=>{})
router.get("/transaction_page/post_transaction",(req,res)=>{})
router.get("/transaction_page/fetch_transaction_history",(req,res)=>{})

router.get("/navigation/export",(req,res)=>{})

router.get("/stock_page/update_stock",(req,res)=>{})
router.get("/stock_page/update_limitation",(req,res)=>{})

router.get("/summary_page/high_level",(req,res)=>{})
router.get("/summary_page/log",(req,res)=>{})




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