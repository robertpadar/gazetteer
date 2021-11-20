var map = L.map( 'map', {
    center: [51.5, 0.09],
    minZoom: 2,
    zoom: 5,
    loadingControl: false
});

L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a','b','c']
}).addTo( map );

var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    /*attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    minZoom: 2,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'sk.eyJ1IjoicHJkcmFjbzIiLCJhIjoiY2tzcmV3NHdqMG1jdDJwdW91ZmxpaHQwMiJ9.9UWHeLd1D6Tn8kvvH-7NkQ'*/
}),
    sattelite = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    minZoom: 2,
    id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibXlsZXNraW5nIiwiYSI6ImNraDY5aHF1MDA4bXMycG81NXdydDIwNW8ifQ.LiVIW0kbaS-7qDJc4S9IyQ'
}),

    OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}),
    OpenRailwayMap = L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://www.OpenRailwayMap.org">OpenRailwayMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}),
    Trails_hiking = L.tileLayer('https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://waymarkedtrails.org">waymarkedtrails.org</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}),
    Trails_cycling = L.tileLayer('https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://waymarkedtrails.org">waymarkedtrails.org</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

var baseMaps = {
    "Street map": street,
    "Sattelite map": sattelite,
    "Topo map": OpenTopoMap,
    "RailWay map": OpenRailwayMap,
    "Hiking map": Trails_hiking,
    "Cycling map": Trails_cycling
};

L.control.layers(baseMaps).addTo(map);

var userLocation = map.locate({setView: true, maxZoom: 7});
function onLocationFound(e) {
    //L.marker(e.latlng).addTo(map)
        //.bindPopup("Your nearby location").openPopup();
    userCountry(e.latlng);
}
map.on('locationfound', onLocationFound);

document.getElementById('country').addEventListener('change', function(data) {
    var value = data['target'].value;
    //console.log(value);
    getData(value);
});

var opts = {
    lines: 12, // The number of lines to draw
    length: 32, // The length of each line
    width: 17, // The line thickness
    radius: 28, // The radius of the inner circle
    scale: 0.75, // Scales overall size of the spinner
    corners: 1, // Corner roundness (0..1)
    speed: 1, // Rounds per second
    rotate: 0, // The rotation offset
    animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#E4354e', // CSS color or array of colors
    fadeColor: 'transparent', // CSS color or array of colors
    top: '50%', // Top position relative to parent
    left: '50%', // Left position relative to parent
    shadow: '0 0 1px transparent', // Box-shadow for the lines
    zIndex: 2000000000, // The z-index (defaults to 2e9)
    className: 'spinner', // The CSS class to assign to the spinner
    position: 'absolute', // Element positioning
    },
    target = document.getElementById('map'),
    spinner = new Spin.Spinner(opts).spin(target);

function userCountry(locate) {
    var lat = locate.lat;
    var lng = locate.lng;
    $.ajax({
        url: "php/setLocationSelected.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: lat,
            lng: lng,
        },
        success: function(result) {
            $('#visible').html(result['data']['countryName']);
            getData(result['data']['countryCode']);
        },

        error: function(jqXHR,textStatus,errorThrown,){
            alert(textStatus + ' : '  + jqXHR.status + ', ' + errorThrown);
        }
    }); 
};

$.ajax({
    url: "php/countryData.php",
    type: 'POST',
    dataType: 'json',
    success: function(result) {
        // Add each country to option value
        $.each(result.data, function(index) {
            $('#country').append($("<option>", {
                value: result.data[index].code,
                text: result.data[index].name,
            }));
        }); 
    },
    error: function(jqXHR,textStatus,errorThrown,){
        alert(textStatus + ' : '  + jqXHR.status + ', ' + errorThrown);
    }
});

function getData(code) {
    map.eachLayer(function(layer) {
        if (!!layer.toGeoJSON) {
          map.removeLayer(layer);
        }
    }),
    $.ajax({
        url: 'php/getCountryInfo.php',
        type: 'POST',
        loadingControl: true,
        dataType: 'json',
        data: {
            country: code,
        },
        beforeSend: function () {
            spinner.spin(target);
        },
        success: function(response) {
            var countryArray = (response['data']['0']);
            var countryCode= code.toLowerCase();
            var languages = countryArray.languages;
            var currencies = countryArray.currencies;
            currenciesName = Object.values(currencies)[0];
            
            $.ajax({
                url:  "php/getNews.php",
                type: 'POST',
                dataType: 'json',
                data:  {temp: countryCode} ,
                success: function(news) {   
                    if(news['data'].articles == '') {
                        var url = 'no data';
                        var description = 'no data';
                        var pic = 'https://biohitech.files.wordpress.com/2014/05/no-data1.png';
                    } else {
                        var url = JSON.stringify(news['data']['articles']['0'].url);
                        var description = JSON.stringify(news['data']['articles']['0'].description);
                        var pic = JSON.stringify(news['data']['articles']['0'].urlToImage);
                    }
                    
                    var popup = L.popup({
                        className: 'blink',
                        //offset: [0, 0],
                        //autoPanPadding: [100,100]
                    })
                    .setContent("<table id='tableContent'>" +
                            "<tr>" +
                                "<td colspan='2' id='popup-img'><img src=" + 
                                countryArray['flags']['1'] + " id='flag' ></img></td>" + 
                            "</tr>" +
                            "<tr>" +
                                "<td colspan='2' id='space'><hr>" + "<a href=" + url + "><b>" + 
                                description + "</b></a><br><img src=" + pic + "><hr></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td colspan='2' id='space'>" + "<b> " + countryArray['altSpellings']['1'] +  
                                " (" + countryArray['cca2'] + ")" + " </b>" + "</td>" + 
                            "</tr>" + 
                            "<tr>" +
                                "<td> Country: </td>" + 
                                "<td>" + countryArray['name']['common'] + "</td>" +
                            "</tr>" + 
                            "<tr>" + 
                                "<td> Continent: </td>"  + 
                                "<td>" + countryArray['region'] +
                            "</tr>" + 
                            "<tr>" + 
                                "<td> Language: </td>"  + 
                                "<td> " + Object.values(languages) + "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td> Area: </td>" + 
                                "<td>" + countryArray['area'] + " Km<sup>2</sup>"+ "</td>" +
                            "</tr>" + 
                            "<tr>" +
                                "<td> Currencies: </td>" + 
                                "<td> " + currenciesName.name + "&emsp;" + currenciesName.symbol + "</td>" + 
                            "</tr>" +
                            "<tr>" +
                                "<td> Lat&Lng: </td>" + 
                                "<td>" + countryArray['latlng'] + "</td>" +
                            "</tr>" + 
                        "</table>"
                    );
                    $.ajax({
                        url:  "php/getGeoJson.php",
                        type: 'POST',
                        dataType: 'json',
                        data: { temp2: code },
                        success: function(result) {
                            var filterData = result.data.geometry;
                            var continent = L.geoJson(filterData).addTo(map); 
                            map.fitBounds(continent.getBounds());
                            continent.bindPopup(popup).openPopup();
                        },
                        error: function(jqXHR,textStatus,errorThrown,){
                            alert(textStatus + ' : '  + jqXHR.status + ', ' + errorThrown);
                        }
                    }) 
                },
                error: function(jqXHR,textStatus,errorThrown,){
                    alert(textStatus + ' : '  + jqXHR.status + ', ' + errorThrown);
                }
            }) 
        }, 
        complete: function (){
            spinner.stop();
        },
        error: function(jqXHR,textStatus,errorThrown,){
            alert(textStatus + ' : '  + jqXHR.status + ', ' + errorThrown);
        }
    })
    
}