// Create the tile layer that will be the background of our map.
let baseMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


// Create the map object with options.
let map = L.map("map", {
    center: [40.73, -74.0059],
    zoom: 2
});


baseMap.addTo(map);


let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(url).then((data) => {
    console.log(data);

    function styleInfo(x) {
        return {
            color: "black",
            radius: radiusMag(x.properties.mag),
            fillOpacity: 1,
            fillColor: fillColorDepth(x.geometry.coordinates[2])
        }
    }

    function radiusMag(params) {
        if (params == 0) {
            return 1
        }
        return params * 3;
    }
    // Function to determine marker color by depth
    function fillColorDepth(params) {
        switch (true) {
            case (params > 90):
                return "#ea2c2c";
            case (params > 70): 
                return "#ea822c";
            case (params > 50):
                return "yellow";
            case (params > 30):
                return "orange";
            case (params > 10):
                return "orangered";

            default:
                return "#98ee00";

        }
    
    }










    L.geoJson(data, {
        pointToLayer: function (feature, latlon) {
            return L.circleMarker(latlon);
        },
        style: styleInfo
    }).addTo(map);






















});