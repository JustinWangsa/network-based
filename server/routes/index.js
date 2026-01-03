var express = require('express');
var router = express.Router();
const fs = require('node:fs');
const path = require('node:path');

const client_browserFolder = '../../client_browser';
const indexfile = '/src/views/login/login.html';



/* GET home page. */
router.get('/', function(req, res) {
  // res.render('index', { title: 'Express' });

  fs.createReadStream(path.join(client_browserFolder,indexfile)).pipe(res)
  
});

router.get('/src/assets/*.svg', (req, res) => {
  // res.render('index', { title: 'Express' });
  let root = path.join(__dirname,'..')
  let url = path.join(root,client_browserFolder,req.url);

  res.header('Content-Type','image/svg+xml');
  fs.createReadStream(url).pipe(res);
  
  // res.sendFile((url));
  
  
});
router.get('/src/*', (req, res) => {
  // res.render('index', { title: 'Express' });
  let url = path.join(client_browserFolder,req.url);
  fs.createReadStream(url).pipe(res);
  
  
  
});

module.exports = router;
