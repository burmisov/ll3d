var async = require('async');
var L = require('leaflet');

var geoJsonMap = function (map, layers, callback) {
	async.map(
		layers,
		function (item, done) {
			$.ajax({
				url: item.geoJsonUrl,
				dataType: 'json',
				success: function (data) {
					var gjLayer = L.geoJson(data, {
						style: item.style
					});

					return done(null, { gjLayer: gjLayer, order: item.order });
				}
			});
		},
		function (err, gjLayers) {
			var i;
			if (err) { if (callback) { return callback(err); } else { throw err; } }
			var sortedLayers = gjLayers.sort(function (l1, l2) { return l1.order < l2.order; });
			var sumLat = 0;
			var sumLng = 0;
			for (i = 0; i < gjLayers.length; i++) {
				gjLayers[i].gjLayer.addTo(map);
				var centLatLng = gjLayers[i].gjLayer.getBounds().getCenter();
				sumLat += centLatLng.lat;
				sumLng += centLatLng.lng;
			}

			map.setView([ sumLat / gjLayers.length, sumLng / gjLayers.length ], 16);

			return callback();
		}
	);
};

module.exports = {
	geoJsonMap: geoJsonMap
};
