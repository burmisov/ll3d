window.L = require('leaflet/dist/leaflet-src.js');

var map = L.map('map').setView([56.14438, 47.25368], 18);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
