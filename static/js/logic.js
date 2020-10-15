// API endpoint
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson"


// Perform a GET request
d3.json(queryUrl, function(data) {
    createFeatures(data.features);
});

//Function to define marker size
function markerSize(feature) {
  return feature.properties.mag * 5;
}

//Variable for marker options
function style(feature) {
  return {
    radius: markerSize(feature),
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };
}

//function to perform on each feature
function createFeatures(earthquakeData) {

  // Create a GeoJSON layer
    var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, style(feature));
          },
      onEachFeature: function(feature, layer) {
        //Pop-up
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + "Magnitude: " + feature.properties.mag + "</p><p>" + "Date: " + new Date(feature.properties.time) + "</p>");        
      }
    });

  // Send earthquakes layer to the createMap function
  createMap(earthquakes);
}


function createMap(earthquakes) {

  // Add tile layers
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "light-v10",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object
  var baseMaps = {
    "Light Map": lightmap,
    "Dark Map": darkmap
  };

  // Create overlay object
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create map
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
