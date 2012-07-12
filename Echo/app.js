
/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , Pusher = require("./modules/Push_Connection").Pusher;


var app = module.exports = express.createServer(express.logger());
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.all('/Echo/:app_id?/:controller/:action', function(req, res) {
    req.format = "json";
    routes.handle(req, res);
});
app.all('/EchoView/:app_id?/:controller/:action', function(req, res) {
    res.format = "html";
    res.view = req.params.controller + "_" + req.params.action;
    routes.handle(req, res);
});



/*
app.get('/', function(req, res){
    res.render('index', { title: 'Express' })
});

app.post('/sendMsg', function(req, res){
    console.log("sending");
    Pusher.sendOneMsg(req.param('regId'), req.param('collapse_key'), req.param('message'), function(err) {
        console.log(err);
        res.render('index', { title: 'Express' })
    })
});
*/
app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
