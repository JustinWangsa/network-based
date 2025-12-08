const {Router, response} = require('express')
const router = Router();

const fs = require("node:fs");

const sql = require('mysql');
const { json } = require('node:stream/consumers');
const con = sql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"test_db"
})
const Response = {
    success:"success",
    fail:"err from sql"
} //TODO convert all response into json {status:success}, use middleware to res.header(json)
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

//TODO above section that include manager function, router.use(if not manager, res.end(fail) )
router.get('/admin/dropTable',async (req,res)=>{
    try{
        // const _E = makeErrHandler(5,res,"Table Drop Successfully")
        await query("drop table if exists stock_t");
        await query("drop table if exists transaction_t");
        await query("drop table if exists user_t");
        await query("drop table if exists item_t");
        await query("drop table if exists company_t");
        
        console.log("------dropped all table");
        res.end(Response.success);
    } catch (e){
        console.log(e);
        res.end(Response.fail);
    }
    
    
})
router.get('/admin/createTable',async (req,res)=>{
    

    try{

        await query(`
            create table company_t(
                id      int AUTO_INCREMENT key,
                name    varchar(1024) unique
            );    
        `)
        await query(`
            create table user_t(
                company_id  int references company_t (id),
                isManager   bool ,
                name        varchar(1024), -- suppose to be unique, but cause virtual bug
                password    binary(40), -- sha1 is 160 bit, but this is hexed so 320 bit
                primary key (company_id,isManager)
            );
        `)
        await query(`
            create table item_t(
                id      int AUTO_INCREMENT Key,
                company_id int references company_t (id),
                name    varchar(256),
                image   longblob default null,
                currentStock   int
                
            );
        `)// name must not be unique, block other company
        await query(`
            create table stock_t(
                company_id int references company_t (id),
                time    datetime, -- [YYYY-MM-DD hh:mm:ss]
                item_id int references item_t (id), -- on delete restrict 
                stock    int,
                price   int,

                primary key (company_id,time,item_id)
            );
        `)
        await query(`
            create table transaction_t(
                company_id int references company_t (id),
                time    datetime, -- [YYYY-MM-DD hh:mm:ss]
                item_id int references item_t (id), -- on delete restrict
                count   int,

                primary key (company_id,time,item_id)
            );
        `)
        
        
        console.log("------created all table ");
        res.end(Response.success);
    } catch(e){
        console.log(e);
        res.end(Response.fail);
    }
    
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

    
    try {
        await query(`
            insert into company_t (name) values (?)
        `,companyName)
    
        await query(`
            insert into user_t set
                company_id = (
                    select id from company_t where name = ?
                ),
                isManager = true,
                name = ?,
                password = SHA1(?)
        `,[companyName, managerName, managerPassword])
    
        await query(`
            insert into user_t set
                company_id = (
                    select id from company_t where name = ?
                ),
                isManager = false,
                name = ?,
                password = SHA1(?)
        `,[companyName, cashierName, cashierPassword])
        
        console.log('------new company created');
        res.end(Response.success)
    } catch (error) {
        console.log(error);
        res.end(Response.fail);
    }
    
    
})

//result: isManager(1|0) 
router.post("/login_page/log_in",async (req,res)=>{
    const {
        password,
        name,
    } = req.body;

    try {
        let result = await query(`
            select 
                U.company_id,
                U.isManager,
                U.name as user_name,
                U.password,
                C.name as company_name
            from user_t U join company_t C on U.company_id = C.id
            where U.name = ? and U.password = SHA1(?)
        `,[name,password])

        req.session.company_id = result[0]?.company_id;
        req.session.isManager = result[0]?.isManager;

        console.log("log in as ",result);
        if(result.length == 0 )res.end(Response.fail);
        else res.end(result[0]?.isManager?.toString());

    } catch (error) {
        console.log(err); 
        res.end(Response.fail);
    }
    
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


// --------------------below this require log-in------------
router.use(function loginCheck(req,res,next){
    console.log("------passed login check");
    
    const company_id = req.session.company_id?? '';
    if(company_id === ''){
        console.log("------company id is null");
        res.end(Response.fail);
    } else {
        req.body.company_id = company_id;
        next();
    }
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
router.post("/stock_page/new_item",async (req,res)=>{
    let { 
        company_id,//from session

        name,
        stock,
        price
    } = req.body;
    const image = req.files?.icon?.data ?? '';
    
    console.log({
        name,
        stock,
        price,
        company_id,
        image:image.toString('base64').substring(0,10),
    });

    try{ 
        let theQuery = sql.format(`
            insert into item_t set 
                company_id = ?,
                name = ?,
                currentStock = ?,
                image = ? 
        `,[company_id,name,Number(stock),image]);
        console.log(theQuery.substring(0,200));
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
 
})
router.post("/stock_page/update_item",async (req,res)=>{
    let { 
        company_id,//from session

        item_id, 
        name,
        stock,
        price
    } = req.body;
    const image = req.files?.icon?.data ?? '';
    let currentStock = stock;

    console.log({
        company_id,
        item_id,
        name,
        stock,//either both filled or both empty
        price,
        image:image.toString('base64').substring(0,10),
    });

    if( (stock=='' && price!='') || (stock!='' && price=='') ){
        console.log('------fail, stock and price have holes');
        res.end(Response.fail);
        return;
    }

    try{
        let changes, input;
        function optAppend(label,value){
            if(value != ''){
                changes.push(`${label} = ?`);
                input.push(value);
            }
        } 

        //stock_t update
        if(price != '' && stock !=''){
            const theQuery = sql.format(`
                insert into stock_t set 
                    company_id = ?
                    ,time = NOW()
                    ,item_id = ?
                    ,price = ?    
                    ,stock = ?    
            `,[company_id,item_id,price,stock])
            
            console.log(theQuery);
            await query(theQuery);
        } else console.log("------stock_t unchanged");

        //item_t update
        input = [];
        changes = [];
        optAppend("name",name);
        optAppend("currentStock",currentStock);//if stock is null, this doesnt do anything
        optAppend("image",image);
        
        if(changes != ''){
            const theQuery = sql.format(`
                update item_t set 
                    ${changes.join(',')}
                where 
                    id = ?
            `,[...input,item_id]) 
            
            console.log(theQuery);
            await query(theQuery); 
        } else console.log("------ item_t unchanged");

        res.end(item_id.toString())
        
    } catch(e){
        console.log(e)
        res.end(Response.fail);
    }
    
})

/* 
return (json): []
*/
router.get("/:_(stock_page|transaction_page)/fetch_item_list",async (req,res)=>{
    try {
        let result = await query(`
            select 
                i.id,
                i.name,
                i.image,
                i.currentStock,
                s.price
            from (
                select * from item_t
                where company_id = 2 
            ) as i
            join (
                select *, max(s.time) over(partition by s.item_id) as recent
                from stock_t s
            ) as s
            on i.id = s.item_id and i.company_id = s.company_id
            where s.time = s.recent
        `)

            
            //TODO start from here
        res.header('Content-Type','application/json')
        res.end(JSON.stringify(result));
    } catch (error) {
        console.log(error);
        res.end(Response.fail)
    }
})


module.exports = router


// /general/log_out(client side)
/* 

---------------------> company_t(
    id      int AUTO_INCREMENT key,
    name    varchar(1024) unique

---------------------> user_t(
    company_id  int references company_t (id),
    isManager   bool ,
    name        varchar(1024) ,
    password    binary(40), 
primary key (company_id,isManager)

---------------------> item_t(
    id              int AUTO_INCREMENT Key,
    company_id      int references company_t (id),
    name            varchar(256) unique,
    image           longblob default null,
    currentStock    int,
    
---------------------> stock_t(
    company_id  int references company_t (id), --actually redundant
    time        datetime,
    item_id     int references item_t (id), 
    stock       int,
    price       int,
primary key (company_id,time,item_id)

---------------------> transaction_t(
    company_id  int references company_t (id),
    time        datetime, 
    item_id     int references item_t (id),
    count       int,
primary key (company_id,time,item_id)


        

--------- include company_t and user_t
/login_page
    /login_page/sign_up
        input: 
            companyName
            managerName 
            managerPassword
            cashierName
            cashierPassword  
        mechanism:
            insert into company_t 
                id=auto
                _companyName
            insert into user_t 
                _companyName
                _managerName
                _managerPassword
            insert into user_t 
                _companyName
                _cashierName
                _cashierPassword    
        return: default
    /login_page/log_in 
        input: 
            password
            name  
        mechanism:
            select isManager,companyid from user_t
            where (n,p)
            
            save isManager,companyid to session
        return: isManager
    /login_page/logout 
        input: nothing
        mechanism: clean the session variable
        return: default    

------ also include item_t and price_t
/stock_page
    /stock_page/new_item
        input: 
            name
            stock
            price
            image
        mechanism:
            new entry to item_t 
                id = auto
                {company_id} = session
                name 
                currentStock = stock
                image
            new entry to stock_t
                {company_id} = session
                time = now()
                item_id = from previous query
                stock 
                price
            also set currentStock into the new stock
        return: item_id
    /stock_page/update_item
        input: 
            item_id
            name
            stock //stock and price, either both filled or both empty
            price
            image
        mechanism:
            if both stock and price are provided
            insert to stock_t
                {company_id} = session
                time = now()
                item_id = from previous query
                _stock 
                _price

            if necessary
            update to item_t 
                _name 
                _currentStock = stock
                _image
            where 
                id = item_id
                
            
        return: item_id
    /stock_page/fetch_item_list
        input: -
        mechanism:
            join item_t and stock_t (I.id, I.name, I.image, I.currentStock, S.price) 
            on (item_id)  
            where company_id, newest date,
        return: [{id:...,name:...},...]
/transaction_page
    /transaction_page/cart_page (client side)
    /transaction_page/post_transaction
        input :
            {item_id:count,...} 
        mechanism:
            for all item, add this to transaction_t
                {company_id}=session
                time = now()
                _item_id 
                _count
            subtract from current 
        return:current stock for each item SENT
    /transaction_page/fetch_transaction_history
        input : -
        mechanism:
            select top 5 newest transaction
        return:{time1:{item...}, time2:{...}}
    /transaction_page/update_transaction
        input :
            - {time:000,item_id:count,...} // should only post item whose count change
        mechanism:
            select from transaction_t
                item_id
                count
            where
                {company_id} = session
                _time 
            
            then find difference

            update transation_t for each item sent
                _item_id
                _count
            where
                {company_id} = session
                _time
            update currentStock in item_t

            update item_t for each item sent
                currentStock = currenstock + difference
                where _item_id 
        return:current stock for each item
/summary_page
    /summary_page/high_level
        just /transaction_page/fetch_transaction_history without limitation
        the client will decide how to display this data 
    /summary_page/log
        just /transaction_page/fetch_transaction_history without limitation
/navigation(manager client side)
    /navigation/export(electron client exclusive)
        implementation
            SELECT * FROM _table INTO OUTFILE '/tmp,csv'
            FIELDS TERMINATED BY ','
            ENCLOSED BY '"'
            LINES TERMINATED BY '\n';

            fs.createReadStream('..').pipe(res)
        return: (binary)



old

create table company_t(
    id      int AUTO_INCREMENT key,
    name    varchar(1024) unique
);

create table user_t(
    company_id  int references company_t (id),
    isManager   bool ,
    name        varchar(1024) , -- suppose to be unique, but cause virtual bug
    password    binary(40), -- sha1 is 160 bit, but this is hexed
    
    primary key (company_id,isManager)
);-- this time I use SHA1() in sql. not bcrypt.hashSync($password, 10)




create table item_t(
    id      int AUTO_INCREMENT Key,
    company_id int references company_t (id),
    name    varchar(256) unique,
    image   blob(65535) default null
    
);

create table transaction_t(
    company_id int references company_t (id),
    time    datetime, -- [YYYY-MM-DD hh:mm:ss]
    item_id int references item_t (id), -- on delete restrict
    count   int,

    primary key (company_id,time,item_id)
);

create table stock_t(
    company_id int references company_t (id),
    date    date, -- [YYYY-MM-DD]
    item_id int references item_t (id), -- on delete restrict 
    stock   int,
    price   int,
    
    primary key (company_id,date,item_id)
);        
*/

