require('dotenv').config();
var express = require('express');
var app = express();
var fs = require("fs");
var port = process.env.PORT || 7750;

app.use(function(request, response, next) {
  var allowedOrigins = ['http://127.0.0.1:7749', 'http://localhost:7749', 'http://localhost:7751', 'http://bedeviere.com', 'http://bimataprathama.com'];
  var origin = request.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1){
    response.setHeader('Access-Control-Allow-Origin', origin);
  }
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/work', function (req, res) {
  fs.readFile( __dirname + "/" + "works.json", 'utf8', function (err, data) {
    var works = JSON.parse( data );
    console.log( works );
    res.end( JSON.stringify(works) );
  });
})

app.get('/work/:slug', function (req, res) {
   fs.readFile( __dirname + "/" + "works.json", 'utf8', function (err, data) {
      var works = JSON.parse( data );
      var work = [];
      var workNext = [];
      for (var i = 0; i < works.results.length; i++) {
        if (works.results[i].slug == req.params.slug) {
          work = works.results[i];
          if (i == works.results.length - 1) {
            workNext = works.results[0];
            work['next_slug'] = workNext.slug;
            console.log( work );
            res.end( JSON.stringify(work) );
          } else {
            workNext = works.results[i+1];
            work['next_slug'] = workNext.slug;
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

var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})