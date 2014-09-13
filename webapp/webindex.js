window.L = require('leaflet/dist/leaflet-src.js');
window.$ = require('jquery/dist/jquery.js');

var vectorMap = require('./vectormap');

var map = L.map('map');

var layers = [
	{
		geoJsonUrl: '/data/buildings.json',
		style: function (feature) { return { color: '#FF0000', weight: 3 } },
		order: 1000
	},
	{
		geoJsonUrl: '/data/landuse.json',
		style: function (feature) { return { color: '#FF00FF', weight: 3 } },
		order: 500
	},
	{
		geoJsonUrl: '/data/poipoly.json',
		style: function (feature) { return { color: '#00FFFF', weight: 3 } },
		order: 2000
	},
	{
		geoJsonUrl: '/data/roads.json',
		style: function (feature) { return { color: '#000000', weight: 5 } },
		order: 3000
	},
	{
		geoJsonUrl: '/data/vegetation.json',
		style: function (feature) { return { color: '#00FF00', weight: 3 } },
		order: 3000
	},
];

var editableLayers = new L.FeatureGroup();

vectorMap.geoJsonMap(map, layers, function (err) {
	map.addLayer(editableLayers);
});

var drawOptions = {
	draw: {
		marker: false
	},
	edit: {
		featureGroup: editableLayers
	}
};

var drawControl = new L.Control.Draw(options);
