const {Router} = require('express');
const router = Router();

router.get('/cookie',(req,res)=>{
    console.log(req.headers.cookie);
    res.end()
})

module.exports = router