const sql = require('mysql')
const con = sql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:'test_db'
})

function query(command){
    return new Promise((res,rej)=>{
        con.query(command,(err,result)=>{
            if(err) rej(err)
            else res(result)
        })
    })
} 

function dump(err,result){
    if(err)console.log(err);
    else console.log(result);
}

let data = {
    1:12,
    4:1,
    5:5
};
let company_id = 1



let entries = Object.entries(data).map(kvPair=>
    //  (company_id, time, item_id, count)
    sql.format('(?,NOW(),?,?)',
    [company_id,kvPair[0],kvPair[1]]
)).join(',');

let command = 'insert into transaction_t values '+entries;
console.log(command);

con.query(command,()=>console.log('done'));




function testing(req_body){
    
    const {
        password,
        name,
    } = req_body;
    // result: company_id | null


    con.query(`
        select * from user_t where name = ? and password = SHA1(?)
    `,[name,password]
    , (err,result)=>{
        if(err){
            console.log(err); 
            // res.end();
        } else {
            let {company_id} = result[0];
            console.log(company_id);
            // res.end(company_id);
        }
    })
    

}



con.end()
/* 
node "d:\tugas\3_1\NetworkApp\Final\Server\server\Ztesting\sqlJS.js";mariadb -uroot -proot -t < "d:\tugas\3_1\NetworkApp\Final\Server\server\Ztesting\api.sql" > "d:\tugas\3_1\NetworkApp\Final\Server\server\Ztesting\SqlOutput.txt"  


*/

