var express = require('express');
var router = express.Router();
var config = require('config.json');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
var ObjectId = require('mongodb').ObjectID;
db.bind('users');

var fs=require('fs');
var file="./app/message.json";
var result=JSON.parse(fs.readFileSync(file));

router.get('/messages', function(req,res){
    db.collection('message').find().toArray(function(err, message){
    if(err){
      console.log('Find messgae err');
    } else {
      console.log('Find messages');
      res.json(message);
    }
  });  
});


router.get('/messageDetail/:id', function(req, res) {
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

router.delete('/deleteMessage/:messageID', function(req, res) {
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

router.put('/updateImportant/', function(req, res) {
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

router.get('/initial',function(req,res){
	console.log("not a problem");
	for(var i=0;i<result.length;i++){
     db.collection('message').save(result[i], function(err, result) {
    if(err)
      console.log('Save message err');
    else
      console.log('Save message to db');
    })
  }
  res.json({ success: true});
});

router.post('/addMessage/',  function(req, res) {
  db.collection('message').save(req.body, function(err, result) {
    if(err)
      console.log('Save message err');
    else
      console.log('Save message to db');
  })
  res.send({ success: true});
});

router.put('/addComment', function(req, res) {
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
router.get('/', function (req, res) {
    return res.redirect('/app');
});

router.get('/clear', function(req,res){
     db.collection('message').remove({}, 
    function(err, data) {
      res.redirect('/login');
  })
});

module.exports = router;