//create an app server
//

var express = require('express')
  , http = require('http');

var app = express();
var server = http.createServer(app);

//set path to the views (template) directory
app.set('views', __dirname + '/views');
app.set('includes', __dirname + '/includes');

//set path to static files
app.use(express.static(__dirname + '/public'));
//handle GET requests on /
app.get('/', function(req, res){res.render('index.jade', {title: 'GovernorHub'});});
//listen on localhost:3000
app.listen(3000);
