var express = require('express');
var router = express.Router();
const fs = require('node:fs');
const path = require('node:path');

const assetsFolder = 'D:\\tugas\\3_1\\NetworkApp\\Final\\Server\\client_browser\\src\\assets';
const viewsFolder = 'D:\\tugas\\3_1\\NetworkApp\\Final\\Server\\client_browser\\src\\views';


/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });

  fs.createReadStream('D:\\tugas\\3_1\\NetworkApp\\Final\\Server\\server\\Ztesting\\form.html').pipe(res)

});

module.exports = router;
