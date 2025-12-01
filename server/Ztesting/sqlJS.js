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


// con.query("select * from user_t where password = sha1('password1')",dump)

//adding
con.query("delete from user_t"      ,dump)
con.query("delete from company_t"   ,dump)
// testing({
//     companyName:"lockheed",
//     managerName:"LH_mg",
//     managerPassword:"password1",
//     cashierName:"LH_csh",
//     cashierPassword:"password2",
// })
function testing(req_body){
    const {
        Password,
        Name,
    } = req_body;


    con.query(`
        insert into company_t (name) values (?)
    `,companyName
    , dump)
    con.query(`
        insert into user_t set
            company_id = (
                select id from company_t where name = ?
            ),
            isManager = true,
            name = ?,
            password = SHA1(?)
    `,[companyName, managerName, managerPassword]
    ,dump)
    con.query(`
        insert into user_t set
            company_id = (
                select id from company_t where name = ?
            ),
            isManager = false,
            name = ?,
            password = SHA1(?)
    `,[companyName, cashierName, cashierPassword]
    ,dump)

}



con.end()
/* 
node "d:\tugas\3_1\NetworkApp\Final\Server\server\Ztesting\sqlJS.js";mariadb -uroot -proot -t < "d:\tugas\3_1\NetworkApp\Final\Server\server\Ztesting\api.sql" > "d:\tugas\3_1\NetworkApp\Final\Server\server\Ztesting\SqlOutput.txt"  


*/

