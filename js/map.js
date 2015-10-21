$(document).ready(function() {
    var map = L.map('map', {
      center: [3, 18.7],
      zoom: 3,
      minZoom: 3
    });

    //tileset
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    , maxZoom: 18
    }).addTo(map);

    //creating geographic layers -- currently city points
    $.getJSON("data/AFprecip.geojson")
        .done(function(data) {
            //waits until data has been loaded to call the following function
            var info = processData(data);
            createPropSymbols(info.timestamps, data);

        })
    .fail(function() { alert("Issues with your data, sir.")});

    function processData(data) {
        var timestamps = [];
        var min = Infinity;
        var max = -Infinity;

        //finds each feature in data storage area of "features"
        for (var feature in data.features){
            //properties (headers) for each feature are storied in this local variable "properties"
            var properties = data.features[feature].properties;

            //runs through the JSON to place columns from csv - this first if refers to a location or a timestamp
            for (var attribute in properties) {
                if (attribute != 'id' &&
                    attribute != 'name' &&
                    attribute != 'lat' &&
                    attribute != 'lon') {

                      //if non of 4 above, it is appended to above array named timestamps
                      if ($.inArray(attribute, timestamps) === -1) {
                          timestamps.push(attribute);
                      }
                      //checks if value of current attribute is lower than currently assigned min, if it is, replaces as min
                      if (properties[attribute] < min) {
                          min = properties[attribute];
                      }
                      //copy of above, just applied to max
                      if (properties[attribute] > max) {
                          max = properties[attribute];
                      }
                }
            }
        }
        //once finalized, returns newly organized data
        return{
              timestamps : timestamps,
              min : min,
              max : max
        }

    };

    function createPropSymbols(timestamps, data) {
        cities = L.geoJson(data).addTo(map);
        console.log(cities);
    }

});
