require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');

var fs=require('fs');
var file="./app/message.json";
var result=JSON.parse(fs.readFileSync( file));

var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
var ObjectId = require('mongodb').ObjectID;
db.bind('users');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

// routes
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));

app.get('/messages', function(req,res){
    db.collection('message').find().toArray(function(err, message){
    if(err){
      console.log('Find messgae err');
    } else {
      console.log('Find messages');
      res.json(message);
    }
  });  
});


app.get('/messageDetail/:id', function(req, res) {
  db.collection('message').findOne({_id: ObjectId(req.params.id)}, 
    function(err, data) {
    if(err){
      console.log('Find message by id err');
    }
    else{
      console.log('Find message detail');
      res.send(data);
    }
  })
});

app.delete('/deleteMessage/:messageID', function(req, res) {
  db.collection('message').remove({_id: ObjectId(req.params.messageID)}, 
    function(err, data) {
    if(err){
      console.log('Delete message by id err');
    }
    else{
      console.log('Delete message');
      res.send(data);
    }
  })
});

app.put('/updateImportant/', function(req, res) {
  var message = {};
  var params = req.body.params;
  console.log(params.important+">>>");
  db.collection('message')
    .update({_id: ObjectId(params.id)},{$set: {important:params.important}}, function(err, data) {
    if(err){
      console.log('Update err');
      message = { data: false };
    }
    else{
      console.log('Updated important');
      message = { data: true };
    }
  });
  res.send(message);
});

app.get('/initial',function(req,res){
	for(var i=0;i<result.length;i++){
     db.collection('message').save(result[i], function(err, result) {
    if(err)
      console.log('Save message err');
    else
      console.log('Save message to db');
    })
  }
  res.send({ success: true});
});

app.post('/addMessage/',  function(req, res) {
  db.collection('message').save(req.body, function(err, result) {
    if(err)
      console.log('Save message err');
    else
      console.log('Save message to db');
  })
  res.send({ success: true});
});

app.put('/addComment', function(req, res) {
  var message = {};
  var params = req.body.params;
  db.collection('message')
    .update({_id: ObjectId(params.id)},{$addToSet: {reply:params.message}}, function(err, data) {
    if(err){
      console.log('Add reply err');
      message = { data: false };
    }
    else{
      console.log('Add reply');
      message = { data: true };
    }
  });
  res.send(message);
});

// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});

app.get('/clear', function(req,res){
     db.collection('message').remove({}, 
    function(err, data) {
      res.redirect('/login');
  })
});
// start server
var server = app.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});