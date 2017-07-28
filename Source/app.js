var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Twitter = require('twitter');
var index = require('./routes/index');
var users = require('./routes/users');
var csvWriter = require('csv-write-stream');
var fs = require('fs');
var writer = csvWriter();



var app = express();

app.set('port', process.env.PORT || 3000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
var client = new Twitter({
  consumer_key: '87t6bC2KqH0BCSurpv56owF1Y',
  consumer_secret: 'n57YB0fV5VpMGVNfVH3MAhVpckDvvBM4msjtph09H6RecVa4l1',
  access_token_key: '327797166-Jp47smzfKwBUgWLyFMlMjrSxmrP7kw8bTLpFLPoY',
  access_token_secret: 	'pWuqbJCmkKVD5X4MZtj51Q1mnDVzPpzUg2GgfsDdvH9aQ'
});


app.get("/trends", function(req,res){

var writer = csvWriter({ headers: ["trends", "number"]})
writer.pipe(fs.createWriteStream('./public/out.csv'));

  var params = {id: 23424977};
  console.log(params)
  client.get('trends/place',params, function(error,data){
    if(error){
      console.log(error)
    }
    else {
      console.log((data[0].trends).length);
      data[0].trends.forEach(function(element) {
       if(element.tweet_volume != null){
         console.log(element)
          writer.write([element.name, element.tweet_volume])
        
       }
      }, this);
       writer.end();
       res.render("bubblechart");
    }
  });
  
});

var server = app.listen(app.get('port'), function() {
    var port = server.address().port;
    console.log('Magic happens on port ' + port);
});

module.exports = app;
