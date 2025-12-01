const {Router} = require('express')
const router = Router();

const sql = require('mysql')
const con = sql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"test_db"
})
function makeErrHandler(taskCount,res,successMsg=""){
    const task = taskCount;
    let completed = 0;
    let fail = 0;
    return function errHandler(err){
        completed++;
        if(err){
            fail++;
            console.log(err)
        }

        if(completed == task){
            if(fail == 0) {
                console.log(successMsg);
                res.end("1")
            }
            else res.end();
        }
    }
}

//result: if(true) 1 else null
router.get('/admin/dropTable',async (req,res)=>{
    const _E = makeErrHandler(5,res,"Table Drop Successfully")
    con.query("drop table if exists stock_t",_E)
    con.query("drop table if exists transaction_t",_E)
    con.query("drop table if exists user_t",_E)
    con.query("drop table if exists item_t",_E)
    con.query("drop table if exists company_t",_E)
    
})

//result: if(true) 1 else null
router.get('/admin/createTable',async (req,res)=>{
    const _E = makeErrHandler(5,res,"Table Created Successfully")

    con.query(`
        create table company_t(
            id      int AUTO_INCREMENT key,
            name    varchar(1024) unique
        );    
    `,_E)
    con.query(`
        create table user_t(
            company_id  int references company_t (id),
            isManager   bool ,
            name        varchar(1024) , -- suppose to be unique, but cause virtual bug
            password    binary(40), -- sha1 is 160 bit, but this is hexed so 320 bit
            primary key (company_id,isManager)
        );
    `,_E)
    con.query(`
        create table item_t(
            id      int AUTO_INCREMENT Key,
            company_id int references company_t (id),
            name    varchar(256) unique,
            image   blob(65535) default null
            
        );
    `,_E)
    con.query(`
        create table transaction_t(
            company_id int references company_t (id),
            time    datetime, -- [YYYY-MM-DD hh:mm:ss]
            item_id int references item_t (id), -- on delete restrict
            count   int,

            primary key (company_id,time,item_id)
        );
    `,_E)
    con.query(`
        create table stock_t(
            company_id int references company_t (id),
            date    date, -- [YYYY-MM-DD]
            item_id int references item_t (id), -- on delete restrict 
            stock   int,
            price   int,
            
            primary key (company_id,date,item_id)
        );
    `,_E)
})

//result: current companyName or null
router.get('/admin/WhoAmI',async (req,res)=>{
    // const _E = makeErrHandler(5,res,"Table Created Successfully")
    
    let company_id = req.session?.company_id?.toString();
    let isManager = req.session?.isManager?.toString();
    con.query('select name from company_t where id = ?'
        ,company_id,(err,result)=>{
        if(err){
            console.log(`unknown user`);
            res.end();
        } else {
            console.log(`I am ${result[0].name}, ${req.session.isManager?"manager":"cashier"}`);
            res.end(result[0].name);
        }
    })

})



//result: if(true) 1 else null
router.post('/login_page/sign_up',async (req,res)=>{
    const {
        companyName,
        managerName,
        managerPassword,
        cashierName,
        cashierPassword,
    } = req.body;

    const _E = makeErrHandler(3, res, "new company added");

    con.query(`
        insert into company_t (name) values (?)
    `,companyName
    ,_E)

    con.query(`
        insert into user_t set
            company_id = (
                select id from company_t where name = ?
            ),
            isManager = true,
            name = ?,
            password = SHA1(?)
    `,[companyName, managerName, managerPassword]
    ,_E)

    con.query(`
        insert into user_t set
            company_id = (
                select id from company_t where name = ?
            ),
            isManager = false,
            name = ?,
            password = SHA1(?)
    `,[companyName, cashierName, cashierPassword]
    ,_E)
    
})

//result: if(true) 1 else null
router.post("/login_page/log_in",(req,res)=>{
    const {
        password,
        name,
    } = req.body;
    // result: company_id | null


    con.query(`
        select 
            U.company_id,
            U.isManager,
            U.name as user_name,
            U.password,
            C.name as company_name
        from user_t U join company_t C on U.company_id = C.id
        where U.name = ? and U.password = SHA1(?)
    `,[name,password]
    , (err,result)=>{
        if(err){
            console.log(err); 
            res.end();
        } else {
            req.session.company_id = result[0]?.company_id;
            req.session.isManager = result[0]?.isManager;

            console.log("log in as ",result);
            res.end("1");
        }
    })
    
})


// need to sign in first
//one per item
//result: if(true) 1 else null
router.post("/stock_page/update_stock",(req,res)=>{//TODO
    
    const { //field can be null, apart 
        item_id, 
        // company_id,//from session
        name,
        image,
        stock,//must be the current value
        price//must be the current value
    } = req.body;
    const company_id = req.session.company_id;
    const _E = makeErrHandler(1,res,`inserted ${name}`);
    
    if(item_id == ''){//new entry
        let insertCmd = "insert into item_t"

        con.query(`
            insert into item_t set 
                company_id = ?,
                name = ?,
                image = ? 
        `,[company_id,name,image]
        ,_E)
        con.query(`
            insert into stock_t set
                company_id = ?,
                date
                item_id
                stock
                price
        `,_E)

    } else {//update
        con.query(`
            insert into 
        `,[]
        ,_E)
    };

    

    /* 
    /stock_page/update_stock
    if item_id is null. date is
    insert into item_t(company_id,name,image) 
        values(company_id,name,null)
    ; 
    insert into stock_t 
        values(company_id,NOW(),item_id,stock,price) 
    ;
        
    else if item_id is valid
    
    send in the form of json {id:{property:newprop}...,noId:[{}]}
    */
    con.query(`
        select * from user_t where name = ? and password = SHA1(?)
    `,[name,password]
    , (err,result)=>{
        if(err){
            console.log(err); 
            res.end();
        } else {
            let company_id = result[0]?.company_id?.toString();
            console.log("company id = ",company_id);
            res.end(company_id);
        }
    })
    
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