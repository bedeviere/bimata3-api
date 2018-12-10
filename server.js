require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var fs = require('fs');
var port = process.env.PORT || 7750;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(function(request, response, next) {
  var allowedOrigins = ['http://127.0.0.1:7749', 'http://localhost:7749', 'http://127.0.0.1:7751', 'http://localhost:7751', 'http://bedeviere.com', 'http://bimataprathama.com'];
  var origin = request.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1){
    response.setHeader('Access-Control-Allow-Origin', origin);
  }
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/work', function (req, res) {
  fs.readFile( __dirname + '/' + 'works.json', 'utf8', function (err, data) {
    var works = JSON.parse( data );
    console.log( works );
    res.end( JSON.stringify(works) );
  });
})

app.get('/work/:slug', function (req, res) {
   fs.readFile( __dirname + '/' + 'works.json', 'utf8', function (err, data) {
      var works = JSON.parse( data );
      var work = [];
      var workNext = [];
      for (var i = 0; i < works.results.length; i++) {
        if (works.results[i].slug == req.params.slug) {
          work = works.results[i];
          if (i == works.results.length - 1) {
            workNext = works.results[0];
            work['next_slug'] = workNext.slug;
            work['next_title'] = workNext.title;
            work['next_thumbnail_path'] = workNext.thumbnail_path;
            console.log( work );
            res.end( JSON.stringify(work) );
          } else {
            workNext = works.results[i+1];
            work['next_slug'] = workNext.slug;
            work['next_title'] = workNext.title;
            work['next_thumbnail_path'] = workNext.thumbnail_path;
            console.log( work );
            res.end( JSON.stringify(work) );
          }
        }
        if (works.results[i].slug != req.params.slug && i == works.results.length - 1) {
          res.end();
        }
      }
   });
})

app.get('/message', function (req, res) {
  fs.readFile( __dirname + '/' + 'messages.json', 'utf8', function (err, data) {
    var messages = JSON.parse( data );
    console.log( messages );
    res.end( JSON.stringify(messages) );
  });
})

app.post('/addMessage', function (req, res) {
  var dataMessage = [];
  fs.readFile( __dirname + '/' + 'messages.json', 'utf8', function (err, data) {
    dataMessage = JSON.parse( data );
    var x = dataMessage.results.length - 1;
    var id = dataMessage.results[x].id + 1;
    dataMessage.results[x+1] = req.body;
    dataMessage.results[x+1].id = id;
    // console.log(dataMessage);
    fs.writeFile( __dirname + '/' + 'messages.json', JSON.stringify(dataMessage), 'utf8', function (err, data) {
      if (err) throw err;
      console.log('The file has been saved!');
      res.end();
    });
  });
})

var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})