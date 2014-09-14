var THREE = require('three');

module.exports.createScene = function (layers) {
	var w = $('#view').width();
	var h = $('#view').height();

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, w / h, 0.1, 1000 );

	var renderer = window.rdr = new THREE.WebGLRenderer({
		canvas: document.getElementById('view'),
		antialias: true
	});
	renderer.setSize(w, h);

	var geometry = new THREE.BoxGeometry(2,2,2);
	var material = new THREE.MeshNormalMaterial();
	var cube = new THREE.Mesh( geometry, material );
	scene.add( cube );

	camera.position.z = 5;

	function render() {
		requestAnimationFrame(render);
		renderer.render(scene, camera);
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
	}
	render();
};
