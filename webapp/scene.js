var THREE = require('three');
var SphericalMercator = require('sphericalmercator');

var sm = new SphericalMercator();

function llSwap (lonlat) {
	var latlon = [lonlat[1], lonlat[0]];
	return latlon;
}

module.exports.createScene = function (layers) {
	//var layers = null;

	var w = $('#view').width();
	var h = $('#view').height();

	var scene = new THREE.Scene();
	var camera = window.cam = new THREE.PerspectiveCamera( 60, w / h, 0.1, 1000 );

	var renderer = window.rdr = new THREE.WebGLRenderer({
		canvas: document.getElementById('view'),
		antialias: true
	});
	renderer.setSize(w, h);

	if (layers) {
		layers.eachLayer(function (layer) {
			var geom = layer.feature.geometry.coordinates;
			var basicRing = geom[0];
			var holeRings = geom.slice(1);
			var i, j;

			var scale = 1;
			var hscale = 6;

			var pos = new THREE.Vector3();
			pos.z = 0;
			var pxy = llSwap(sm.forward(llSwap(basicRing[0])));
			pos.x = pxy[0];
			pos.y = pxy[1];
			console.log('p>', pos);

			var shape = new THREE.Shape();
			for (i = 0; i < basicRing.length; i++) {
				var p = llSwap(sm.forward(llSwap(basicRing[i])));
				shape.moveTo(p[0] * scale - pos.x, p[1] * scale - pos.y);
			}

			for (j = 0; j < holeRings.length; j++) {
				var hole = new THREE.Path();
				for (i = 0; i < holeRings[j].length; i++) {
					var p = llSwap(sm.forward(llSwap(holeRings[j][i])));
					hole.moveTo(p[0] * scale - pos.x, p[1] * scale - pos.y);
				}

				shape.holes.push(hole);
			}

			console.log(layer.feature);

			var height = layer.feature.properties['B_LEVELS'] * hscale;
			console.log('bl> ', layer.feature.properties['B_LEVELS']);
			var houseGeometry = shape.extrude({
				amount: height,
				bevelEnabled: false,
				material: 0,
				extrudeMaterial: 0
			});

			var material = new THREE.MeshNormalMaterial();
			var houseMesh = window.hm = new THREE.Mesh(houseGeometry, material);
			houseMesh.position.x = pos.x;
			houseMesh.position.y = pos.y;
			houseMesh.position.z = pos.z;

			scene.add(houseMesh);
			console.log(houseMesh);

			camera.position.x = 5993256.531453259;
			camera.position.y = 6245827.850407017;
			camera.position.z = 6;
			camera.lookAt(houseMesh.position);
			camera.rotateZ(Math.PI/2)
		});
	} else {
		var geometry = new THREE.BoxGeometry(2,2,2);
		var material = new THREE.MeshNormalMaterial();
		var cube = new THREE.Mesh( geometry, material );
		scene.add( cube );
		camera.position.z = 5;
	}

	function render() {
		requestAnimationFrame(render);
		renderer.render(scene, camera);
		// cube.rotation.x += 0.01;
		// cube.rotation.y += 0.01;
	}

	if (layers) {
		render();
	} else {
		render();
	}
};
