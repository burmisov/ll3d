window.L = require('leaflet/dist/leaflet-src.js');
require('leaflet-draw/dist/leaflet.draw-src.js');
window.$ = require('jquery/dist/jquery.js');
var _ = require('underscore');

var vectorMap = require('./vectormap');

var map = L.map('map', {
	attributionControl: false
});

var layers = [
	{
		geoJsonUrl: '/data/buildings.json',
		style: function (feature) { return { color: '#CC3300', weight: 3, opacity: 1, fillOpacity: 1 } },
		order: 10000
	},
	{
		geoJsonUrl: '/data/landuse.json',
		style: function (feature) { return { color: '#999999', weight: 3, opacity: 1, fillOpacity: 1 } },
		order: 3000
	},
	{
		geoJsonUrl: '/data/poipoly.json',
		style: function (feature) { return { color: '#77AABB', weight: 3, opacity: 1, fillOpacity: 1 } },
		order: 4000
	},
	{
		geoJsonUrl: '/data/roads.json',
		style: function (feature) {
			var style = { opacity: 1, fillOpacity: 1 };
			switch (feature.properties.HIGHWAY) {
				case 'service': style.weight = 3; style.color = '#000000'; break;
				case 'primary': style.weight = 5; style.color = '#000000'; break;
				case 'secondary': style.weight = 4; style.color = '#000000'; break;
				case 'residential': style.weight = 2; style.color = '#000000'; break;
				case 'footway': style.weight = 1; style.color = '#000000'; style.opacity = 0.5; break;
				default: style.weight = 1; style.color = '#000000'; break;
			}
			return style;
		},
		order: 2000
	},
	{
		geoJsonUrl: '/data/vegetation.json',
		style: function (feature) { return { color: '#55FF33', weight: 3, opacity: 1, fillOpacity: 1 } },
		order: 5000
	}
];

var editableLayers = new L.FeatureGroup();
var selectedLayers = new L.FeatureGroup();

vectorMap.geoJsonMap(map, layers, function (err) {
	map.addLayer(editableLayers);
	map.addLayer(selectedLayers);
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

map.on('draw:created', function (e) {
	editableLayers.clearLayers();
	editableLayers.addLayer(e.layer);

	findIntersections(e.layer);
});

function findIntersections (ilay) {
	selectedLayers.clearLayers();
	var bounds = ilay.getBounds();
	layers[0].gjLayer.eachLayer(function (layer) {
		var otherBounds = layer.getBounds();
		if (bounds.intersects(otherBounds)) {
			var p = new L.Polygon(layer.getLatLngs());
			p.setStyle({
				// fill: false,
				color: '#FFFF00'
			});
			selectedLayers.addLayer(p);
		}
	});
}
