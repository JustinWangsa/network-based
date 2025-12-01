const {Router} = require('express')
const router = Router();

const sql = require('mysql')
const con = sql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"test_db"
})



router.post('/login_page/sign_up',async (req,res)=>{
    const {
        companyName,
        managerName,
        managerPassword,
        cashierName,
        cashierPassword,
    } = req.body;

    const apiName = '/login_page/sign_up';
    let success = 0;
    const target = 3;
    function errHandler(err,result){
        if(err){
            console.log(err);
            success = success<0?success-1:-1;
        } else success = success<0?success:success+1;
        switch(success){
            case target: res.end(`${apiName} success`);break;
            case -1: res.end(`${apiName} fail`);break;
        }
    }

    con.query(`
        insert into company_t (name) values (?)
    `,companyName
    ,errHandler)

    con.query(`
        insert into user_t set
            company_id = (
                select id from company_t where name = ?
            ),
            isManager = true,
            name = ?,
            password = SHA1(?)
    `,[companyName, managerName, managerPassword]
    ,errHandler)

    con.query(`
        insert into user_t set
            company_id = (
                select id from company_t where name = ?
            ),
            isManager = false,
            name = ?,
            password = SHA1(?)
    `,[companyName, cashierName, cashierPassword]
    ,errHandler)
    
})


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