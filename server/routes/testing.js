const {Router} = require('express');
const router = Router();
const {inspect} = require('util');

const sql = require('mysql')
const con = sql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"test_db"
})




router.all('/sendImg',(req,res)=>{
    con.query("insert into img(data) values(?)",req?.files?.profile?.data,(err,res)=>{//insert binary data
        if(err)console.log(err);
        else console.log("success send");
    });

     /* 

    data:image/png;base64,
{
    mySample: {
    name: 'SearchResults20251126124802.csv',    
    data: <Buffer ef bb bf 53 65 6c 65 63 74 2c 2b 2c 52 65 73 75 6c 74 20 23 2c 58 2c 31 2c 32 2c 33 2c 34 2c 35 2c 44 6f 63 75 6d 65 6e 74 20 49 44 2c 44 61 74 65 20 ... 4519 more bytes>,   
    size: 4569,
    encoding: '7bit',   
    tempFilePath: '',   
    truncated: false,   
    mimetype: 'text/csv',
    md5: '05c41cecc4d272d41a09f4a0a5230a27',    
    mv: [Function: mv]  
  }
}
    
    */
})
router.all('/getImg',(req,res)=>{
    con.query("select data from img where id=1",(err,result)=>{
        // res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
        // res.header("Access-Control-Allow-Headers", "Content-Type")
        res.header("Access-Control-Allow-Origin", "*");
        res.end(result[0].data.toString('base64'));
    })
})

router.all('/', (req,res)=>{
    req.session.a = (req.session.a??1000)+1;
    console.log("---cookie test:",req.session.a);
    console.log("---header:",req.headers);
    console.log("---data:",req?.body);
    console.log("---filedata:",req?.files?.myfile?.data);

    res.end(req.session.a.toString());

   
    
    
})

module.exports = router

/* 

//url encoded
curl localhost:3000/testing -X POST\
    -H "Content-Type:application/x-www-form-urlencoded"\
    -d "a=10"\
    -d "b=11"

//json
curl localhost:3000/testing -X POST\
    -H "Content-Type:application/json"\
    -d "a=10"\
    -d "b=11"

*/