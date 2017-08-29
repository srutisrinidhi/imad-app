var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var config = {
    user: 'srutisrinidhi',
    database: 'srutisrinidhi',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};
var crypto = require('crypto');
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

var counter = 0;
app.get('/counter', function (req, res) {
    counter = counter +1;
  res.send(path.join(counter.toString()));
});


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
var pool = new Pool(config);
app.get('/test-db', function (req, res) {
    pool.query('SELECT * FROM test', function (err, result){
       if (err){
           res.status(500).send(err.toString());
            } 
            else{
                res.send(JSON.stringify(result));
            } 
    });
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});
function hash(input, salt) {
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512 , 'sha512');
    return ['pbkdf2', '10000', salt, hashed.toString('hex')].join('$');
}
app.get('/hash/:input', function (req, res) {
  var hashedString = hash(req.params.input, 'this-is-a-random-string');
  res.send(hashedString);
});
app.post('/create-user', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var salt = crypto.randomBytes(128).toString('hex');    
  var dbString = hash(password, salt);
  pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function(err, result){
             if (err){
           res.status(500).send(err.toString());
            } 
            else{
                res.send('User successfully created: ', username);
            }
  });
});
app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});
app.get('/article/:articleName', function(req,res){
    pool.query("SELECT * FROM article WHERE title = '" + req.params.articleName + "'", function (err, result){
       if (err){
           res.status(500).send(err.toString());
            } 
            else{
                if (result.rows.length === 0){
                    res.status(404).send('Article not found');
                } else {
                    var articleData =result.rows[0];
                    res.send(createTemplate(articleData));
    
                }
            } 
    });
    
});
app.get('/ui/main.js', function(req,res){
    res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});
// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
var names =[];
app.get('/submit-name', function(req, res) {
    var name = req.query.name;
    names.push(name);
    res.send(JSON.stringify(names));
});