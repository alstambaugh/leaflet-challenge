// API endpoint
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson";
var plateUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Perform a GET request
d3.json(queryUrl, function(data) {
    createFeatures(data.features);
});

//Initialize plate layer
var platesLayer = new L.LayerGroup()

//Get plates layer
d3.json(plateUrl, function(data) {
    var plates = L.geoJson(data.features);
      plates.addTo(platesLayer)
    });


//Function to define marker size
function markerSize(feature) {
  return feature.properties.mag * 5;
}

function chooseColor(feature) {
  var depth = feature;
    if (depth < 10) {
      return "#00FF00"
    }
    else if (depth < 30) {
      return "#ccff00"
    }
    else if (depth < 50) {
      return "#FFCC00"
    }
    else if (depth < 70) {
      return "#ff6600"
    }
    else if (depth < 90) {
      return "#FF3300"
    }
    else {
      return "#FF0000"
    }
    
}


//Variable for marker options
function style(feature) {
  return {
    radius: markerSize(feature),
    fillColor: chooseColor(feature.geometry.coordinates[2]),
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
        "</h3><hr><p>" + "Magnitude: " + feature.properties.mag + "<br>" + "Depth: " + feature.geometry.coordinates[2] + "</p><p>" + "Date: " + new Date(feature.properties.time) + "</p>");
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

  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
  });
  
  // Create map
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [lightmap, earthquakes, platesLayer]
  });
  
  // Define a baseMaps object
  var baseMaps = {
    "Light Map": lightmap,
    "Dark Map": darkmap,
    "Satellite": satellite
  };

  // Create overlay object
  var overlayMaps = {
    Earthquakes: earthquakes,
    Plates: platesLayer
  };

  // Create a layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Create legend
  L.control.Legend({
    position: 'bottomright',
    collapsed: false,
    symbolWidth: 24,
    opacity: 1,
    column: 1,
    legends: [{
      label: "<10",
      type: "rectangle",
      color: "#00FF00",
      fillColor: "#00FF00",
      weight: 1
    }, {
      label: "10-30",
      type: "rectangle",
      color: "#ccff00",
      fillColor: "#ccff00",
      weight: 1
    }, {
      label: "30-50",
      type: "rectangle",
      color: "#FFCC00",
      fillColor: "#FFCC00",
      weight: 1
    }, {
      label: "50-70",
      type: "rectangle",
      color: "#ff6600",
      fillColor: "#ff6600",
      weight: 1
    }, {
      label: "70-90",
      type: "rectangle",
      color: "#FF3300",
      fillColor: "#FF3300",
      weight: 1
    }, {
      label: "90+",
      type: "rectangle",
      color: "#FF0000",
      fillColor: "#FF0000",
      weight: 1
     
    }]
  })
.addTo(myMap);
  

}
