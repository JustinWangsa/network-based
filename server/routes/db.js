const {Router, response} = require('express')
const router = Router();

const sql = require('mysql')
const con = sql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"test_db"
})
const Response = {
    success:"success",
    fail:"fail"
}
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
                res.end(Response.success)
            }
            else res.end(Response.fail);
        }
    }
}


/**
 * 
 * @param {string} qry 
 * @param {*} value 
 * @returns {Promise} 
 */
function query(qry,value){
    return new Promise((res,rej)=>{
        con.query(qry,value,(err,result)=>{
            if(err)rej(err)
            else res(result)
        })
    })
}

//TODO convert all con.query into query


//return: default
router.get('/admin/dropTable',async (req,res)=>{
    const _E = makeErrHandler(5,res,"Table Drop Successfully")
    con.query("drop table if exists stock_t",_E)
    con.query("drop table if exists transaction_t",_E)
    con.query("drop table if exists user_t",_E)
    con.query("drop table if exists item_t",_E)
    con.query("drop table if exists company_t",_E)
    
})

//return: default
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
            image   longblob default null
            
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
            time    datetime, -- [YYYY-MM-DD hh:mm:ss]
            item_id int references item_t (id), -- on delete restrict 
            stock   int,
            price   int,
            
            primary key (company_id,time,item_id)
        );
    `,_E)
})

//result: current companyName 
router.get('/admin/WhoAmI',async (req,res)=>{
    
    let company_id = req.session?.company_id?.toString();
    let isManager = req.session?.isManager?.toString();
    console.log({company_id,isManager});

    con.query('select name from company_t where id = ?'
        ,company_id,(err,result)=>{
        if(err){
            console.log(`unknown user`);
            res.end(Response.fail);
        } else {
            console.log(`I am ${result[0].name}, ${req.session.isManager?"manager":"cashier"}`);
            res.end(result[0].name);
        }
    })

})

//result: default
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

/* 
input:{
    name, 
    password,
}
result: isManager(1 or 0) 
*/
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
            res.end(Response.fail);
        } else {
            req.session.company_id = result[0]?.company_id;
            req.session.isManager = result[0]?.isManager;

            console.log("log in as ",result);
            if(result.length == 0 )res.end(Response.fail);
            else res.end(result[0]?.isManager?.toString());
        }
    })
    
})

//result: default
router.get("/login_page/log_out",(req,res)=>{
    delete req.session.company_id;  
    delete req.session.isManager;
    console.log({
        company_id:req.session.company_id, 
        isManager:req.session.isManager
    });

    res.end(Response.success);
})

/* 
- prerequisite: /login_page/log_in
- one per item. 
- input:{
    - item_id. null means its a new item
    - name. -can be null if item_id is not null. Needs to be unique
    - image. -can be null
    - stock. 
    - price. (make sure stock and price are either both empty or both filled)
}
result: if(true) item_id else null
*/
router.post("/stock_page/update_stock",async (req,res)=>{//TODO
    
    let { 
        // company_id,//from session
        item_id, //null meant its a new item
        name,
        stock,
        price//stock and price must be both empty or valued
    } = req.body;
    const image = req.files?.icon?.data ?? '';
    const company_id = req.session.company_id?? '';

    console.log({
        company_id,
        item_id,
        name,
        image:image.toString('base64').substring(0,10),
        stock,
        price,
    });

    if(company_id === ''){
        console.log("cant insert, company id is null");
        res.end(Response.fail);
        return;
    }
    
    if(item_id == ''){//new entry
        console.log("item has no id");
        try{ //
            let theQuery = sql.format(`
                insert into item_t set 
                    company_id = ?,
                    name = ?,
                    image = ? 
            `,[company_id,name,image]);
            console.log(theQuery);
            let okPacket = await query(theQuery);

            item_id = okPacket.insertId;
            
            theQuery = sql.format(`
                insert into stock_t set 
                    company_id = ?,
                    time = NOW(),
                    item_id = ?,
                    stock = ?,
                    price = ?   
            `,[
                company_id,
                item_id,
                Number(stock),
                Number(price)
            ]);
            console.log(theQuery);
            await query(theQuery);


            res.end(item_id.toString());
        } catch(e){
            console.log(e)
            res.end(Response.fail);
        }


    } else {//update
        //for item_t field, if null then dont update
        try{
            let changes, input;
            function optAppend(label,value){
                if(value != ''){
                    changes.push(`${label} = ?`);
                    input.push(value);
                }
            }
            
            //item_t update
            input = [];
            changes = [];
            optAppend("name",name);
            optAppend("image",image);
            
            if(changes != ''){
                const theQuery = sql.format(`
                    update item_t set 
                        ${changes.join(',')}
                    where 
                        company_id = ? and 
                        id = ?
                `,[...input,company_id,item_id]) 
                
                console.log(theQuery);
                await query(theQuery); 
            } else console.log("item_t unchanged");

            //stock_t update
            if(stock != '' && price != ''){
                const theQuery = sql.format(`
                    insert into stock_t set 
                        company_id = ?
                        ,time = NOW()
                        ,item_id = ?
                        ,stock = ?
                        ,price = ?    
                `,[company_id,item_id,stock,price])
                
                console.log(theQuery);
                await query(theQuery);
            } else console.log("stock_t unchanged");
    
            res.end(item_id.toString())
           
        } catch(e){
            console.log(e)
            res.end(Response.fail);
        }

    };

    

 
    
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