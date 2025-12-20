const fs = require('node:fs')

const sql = require('mysql')
const path = require('node:path')
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

// let {time, ...data} = {time:"mytime",0:12,3:123};
// console.log(time);
// console.log(data);
let a = {
    d :{c:1}
}
let b = "b", c = "c";
console.log(a);
console.log(a[b]?.[c]??"null val");
console.log(a[b][c]);


async function hhh(){
    console.log("processing");

    try{
        let item_query = sql.format(`
            select id,name from item_t 
            where company_id = ?    
        `,1);
        let ta_query = sql.format(`
            select time,item_id,count from transaction_t 
            where company_id = ?    
            order by time desc
        `,1);
        let stock_query = sql.format(`
            select time,item_id,price from stock_t 
            where company_id = ? 
            order by time desc   
        `,1);

        /** @type {{id:string,name:string}[]}  */
        let item_list = await query(item_query);
        /** @type {{time:Date,item_id:number,count:number}[]}  */
        let ta_list = await query(ta_query);
        /** @type {{time:Date,item_id:number,price:number}[]}  */
        let stock_list = await query(stock_query);

        //initializing
        /** @type {[number,String][]} */
        const item_name_list = item_list.map(v=>v.name)
        /** @type {number[]} */
        const item_id_list = item_list.map(v=>v.id)
        /** @type {[number,number][]} */
        // const template = item_id_list.map(v=>[v,0]);
        item_list = null;



        /** @type {number[]} */
        let time_list = [...new Set(
            ta_list.map(v=>v.time.getTime())
        )]
        let template = Object.fromEntries(
            time_list.map(v=>[v,Object.fromEntries(
                item_id_list.map(v=>[v,0])
            )])
        );
        
        

        //------count table
        let count_table = structuredClone(template)
        ta_list.forEach(v=>{
            count_table[v.time.getTime()][v.item_id] = v.count
        })        
        ta_list = null;
        // console.log({count});//turn this into csv

        //-----price table 
        let price_table = structuredClone(template);
        stock_list.forEach(v=>{
            let item_id = v.item_id;
            let stock_time = v.time.getTime();
            let stock_price = v.price;

            for( let ta_time in price_table){
                if(ta_time <= stock_time ) break;
                if(price_table[ta_time][item_id] != 0)continue;
                price_table[ta_time][item_id] = stock_price
            }   
        })
        stock_list = null;
        // console.log(price);

        
        //------creating the csv
        function time2str(dateObj){
            return dateObj.getFullYear().toString().padStart(4,'0')
            +'-'+(dateObj.getMonth()+1).toString().padStart(2,'0')
            +'-'+dateObj.getDate().toString().padStart(2,'0')
            +' '+dateObj.getHours().toString().padStart(2,'0')
            +':'+dateObj.getMinutes().toString().padStart(2,'0')
            +':'+dateObj.getSeconds().toString().padStart(2,'0')
        }
        let file = fs.createWriteStream(path.join(__dirname,'mycsv.csv'))      
        file.write(["time",...item_name_list].join(','))
        file.write('\n')

        // //---transaction csv
        // time_list.forEach(ta_time=>{
        //     file.write(    
        //         `${time2str(new Date(ta_time))},` + 
        //         Object.values(count_table[ta_time]).join(',') + 
        //         '\n'
        //     )
            
        // })

        //---price csv
        time_list.forEach(ta_time=>{
            file.write(    
                `${time2str(new Date(ta_time))},` + 
                Object.values(price_table[ta_time]).join(',') + 
                '\n'
            )
            
        })
        
        

        file.close();
        
        
        
        
        
        

        
        
            



        
        

    } catch (e){
        console.log(e);
        

    }
    con.end()
}


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




/* 
node "d:\tugas\3_1\NetworkApp\Final\Server\server\Ztesting\sqlJS.js";mariadb -uroot -proot -t < "d:\tugas\3_1\NetworkApp\Final\Server\server\Ztesting\api.sql" > "d:\tugas\3_1\NetworkApp\Final\Server\server\Ztesting\SqlOutput.txt"  


*/

