var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();
var config = require('./package.json').config;
var port = process.env.PORT || 8080;  
var jsonParser = bodyParser.json()
var Journey = require('./models/journey.js');

mongoose.connect('mongodb://localhost/test');

app.use('/css', express.static('css'));
app.use('/js', express.static('js'));

app.set('view engine', 'jade');
app.set('views', './views');

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/offer', function (req, res) {
    res.render('offer', { config: config });
});

app.post('/offer', jsonParser, function (req, res) {
    var journey = new Journey();
    journey.from = req.body.from;
    journey.to = req.body.to;
    journey.datetime = req.body.datetime;
    journey.validate(function(err) {
          if (err) res.status(403).send(err);       
    });
    if(!req.body.dry_run)
      journey.save(function(err, obj) {
        if (err) res.status(403).send(err);
        res.send(req.protocol + '://' + req.get('host') + '/journey/' + obj.id);
      });
});

app.get('/journey/:journeyId', function (req, res) {
  Journey.findById(req.params.journeyId, function(err, journey) {
    if (err) res.status(404).send(err);
    res.render('journey', { journey: journey, config: config});
  });
});

app.listen(port, function () {
    console.log('Example app listening !');
});


