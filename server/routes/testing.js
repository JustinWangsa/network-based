const {Router} = require('express');
const router = Router();

router.get('/bbb',(req,res)=>{
    console.log("in testing");
    res.end()
})

module.exports = router