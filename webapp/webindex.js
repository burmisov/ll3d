window.L = require('leaflet/dist/leaflet-src.js');
require('leaflet-draw/dist/leaflet.draw-src.js');
window.$ = require('jquery/dist/jquery.js');

var vectorMap = require('./vectormap');

var map = L.map('map');

var layers = [
	{
		geoJsonUrl: '/data/buildings.json',
		style: function (feature) { return { color: '#FF0000', weight: 3, opacity: 1 } },
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
		polyline: false,
		polygon: false,
		circle: false,
		marker: false,
	},
	edit: {
		featureGroup: editableLayers,
		edit: false,
		remove: false
	}
};

L.drawLocal.draw.toolbar.buttons.rectangle = 'Выбрать область для просмотра в 3D';
L.drawLocal.draw.toolbar.actions.text = 'Отменить';
L.drawLocal.draw.handlers.rectangle.tooltip.start =
	'Нажмите и удерживайте левую кнопку чтобы выделить квадратную область';
L.drawLocal.draw.handlers.simpleshape.tooltip.end =
	'Отпустите кнопку чтобы завершить выбор области';

var drawControl = new L.Control.Draw(drawOptions);
map.addControl(drawControl);
