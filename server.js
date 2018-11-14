var express = require('express');
var app = express();
var fs = require("fs");

app.use(function(request, response, next) {
  var allowedOrigins = ['http://127.0.0.1:7749', 'http://localhost:7749', 'http://bimataprathama.com'];
  var origin = request.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1){
    response.setHeader('Access-Control-Allow-Origin', origin);
  }
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/work', function (req, res) {
  fs.readFile( __dirname + "/" + "works.json", 'utf8', function (err, data) {
    console.log( data );
    res.end( data );
  });
})

app.get('/work/:slug', function (req, res) {
   // First read existing users.
   fs.readFile( __dirname + "/" + "works.json", 'utf8', function (err, data) {
      var works = JSON.parse( data );
      var work = [];
      for (var i = 0; i < works.results.length; i++) {
        if (works.results[i].slug == req.params.slug) {
          work = works.results[i];
          console.log( work );
          res.end( JSON.stringify(work));
        }
      }
   });
})

var server = app.listen(7750, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})