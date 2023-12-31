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
            color: "grey",
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
                return "#ffff00";
            case (params > 30):
                return "#ffa500";
            case (params > 10):
                return "#ff4500";

            default:
                return "#98ee00";

        }

    }

    L.geoJson(data, {
        pointToLayer: function (feature, latlon) {
            return L.circleMarker(latlon);
        },
        style: styleInfo,
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h2>Magnitude: " + feature.properties.mag + "<br><h2>Location: " + feature.properties.place + "<br><h2>Depth: " + feature.geometry.coordinates[2]
            );

        }
    }).addTo(map);

    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        let depth = [-10, 10, 30, 50, 70, 90];
        let colors = ["#ea2c2c", "#ea822c", "#ffff00", "#ffa500", "#ff4500", "#98ee00"];

        // div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
        // for (var i = 0; i < depth.length; i++) {
        //     div.innerHTML +=
        //         "<i style='background: " + colors[i] + "'></i> " +
        //         depth[i] + (depth[i + 1] ? "&ndash;" + depth[i + 1] + "<br>" : "+");
        // }
        for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
                "<i style='background: " + colors[i] + "; display: inline-block; width: 10px; height: 10px;'></i> " +
                depth[i] + (depth[i + 1] ? "&ndash;" + depth[i + 1] + "<br>" : "+");
        }
        return div;
    };
    legend.addTo(map);
});

