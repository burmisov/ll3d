var express = require('express');
var browserify = require('browserify-middleware');
var path = require('path');

var app = express();
app.set('view engine', 'jade');

app.use('/data', express.static(path.join(process.cwd(), 'data'), {
	setHeaders: function (res) {
		res.header('Content-type', 'application/json; charset=utf-8');
	}
}));

app.get('/js/bundle.js', browserify(path.join(process.cwd(), 'webapp/webindex.js')));
app.get('/css/bundle.css', function (req, res) {
	res.sendFile(path.join(process.cwd(), 'node_modules/leaflet/dist/leaflet.css'));
});
app.use('/css/leaflet-draw', 
	express.static(path.join(process.cwd(), 'node_modules/leaflet-draw/dist'))
);

app.get('/', function (req, res) {
	res.render('index');
});

var port = process.env.PORT || 4080;
app.listen(port);
console.log('Server listening on port', port);
