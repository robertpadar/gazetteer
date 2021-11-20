document.cookie = "username=prdraco"

var previousLayers = [];

document.getElementById('weather').addEventListener('click', function() {
    getWeather();
});
document.getElementById('foreCast').addEventListener('click', function() {
    getForecast();
});
document.getElementById('wind').addEventListener('click', function() {
    getWindSpeed();
});
document.getElementById('rain').addEventListener('click', function() {
    getPrecipitation();
});

function getWeather() {
    if(previousLayers.length >= 1 ) {
        L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: ['a','b','c']
        }).addTo( map );
    }
    var cloud = L.tileLayer( 'https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid=484cfe59559077c9f0665bc7cb8ad793', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    layer: 'clouds_new',
    subdomains: ['a','b','c']
    }).addTo( map );
    cloud.addTo(map);
    previousLayers.push(cloud);
    map.on('click', function(e){
        $(".leaflet-marker-icon").remove();
        $(".leaflet-marker-shadow").remove();
        var coord = e.latlng;
        var lat = coord.lat;
        var lng = coord.lng;
        var marker = L.marker([lat, lng]).addTo(map).on('click', function() {
            map.removeLayer(marker);
        });
        $.ajax({
            url: 'php/getWeather.php',
            type: 'POST',
            dataType: 'json',
            data: {
                lat: lat,
                lng: lng
            },
            success: function(result) {
                
                if (result.status.name == "ok") {
                    
                    var stationName = result['data']['list']['0']['name'];
                    var countryCode = result['data']['list']['0']['sys'].country;
                    var temperature = result['data']['list']['0']['main'].temp;
                    var clouds = result['data']['list']['0']['weather']['0'].description;
                    var datetime = result['data']['list']['0'];
                    var windSpeed = result['data']['list']['0']
                    temperature = temperature - 273;
                    console.log(clouds);
                    console.log(result['data']['list']['0']['rain']);
                    var popup = L.popup({
                        className: 'weather-popup',
                        //offset: [180, 250]
                    })
                    .setContent('<div class="container-fluid mx-auto">' +
                    '<div class="row d-flex justify-content-center px-3">' +
                        '<div class="card">' +
                            '<h2 class="ml-auto mr-4 mt-3 mb-0">' + stationName + 
                            '&nbsp;&nbsp;' + countryCode + '</h2>' +
                            '<p class="ml-auto mr-4 mb-0 med-font">Snow</p>' +
                            '<h1 class="ml-auto mr-4 large-font">' + temperature.toFixed(1) + '&#176;</h1>' +
                            '<p class="time-font mb-0 ml-4 mt-auto">08:30 <span class="sm-font">AM</span></p>' +
                            '<p class="ml-4 mb-4">Wednesday, 18 October 2019</p>' +
                        '</div>' +
                    '</div>' +
                '</div>')
                    /*('<div>'+
                    '<b>' + stationName + '</b><br>'+
                    "Country Code: "+'<b>' + countryCode + '</b><br>'+
                    "Temperature: "+'<b>' + temperature + '</b><br>'+
                    "Clouds: "+'<b>' + clouds + '</b><br>'+
                    "Datetime: "+'<b>' + datetime + '</b><br>'+
                    "lat, lng: "+'<b>' + lat + '&nbsp;&nbsp;&nbsp' + lng + '</b><br>'+
                    "Wind Speed: "+'<b>' + windSpeed + '</b><br>'+
                    '</div>');*/
                    
                    marker.bindPopup(popup).openPopup().addTo(map);
                }
            },
            error: function(jqXHR,textStatus,errorThrown,){
                if(jqXHR.status == '200') {
                    alert('No data Availabe');
                } else {
                    alert(textStatus + ' : '  + jqXHR.status + ', ' + errorThrown);
            }}
        }); 
    });
}

function getForecast() {
    map.off('click');
    $(".leaflet-marker-icon").remove();
    $(".leaflet-marker-shadow").remove();
    if(previousLayers.length >= 1) {    
        L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: ['a','b','c']
        }).addTo( map );
    }
    var weather = L.tileLayer( 'https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid=484cfe59559077c9f0665bc7cb8ad793', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    layer: 'temp_new',
    subdomains: ['a','b','c']
    }).addTo( map );
    weather.addTo( map );
    previousLayers.push(weather);
}

function getWindSpeed() {
    map.off('click');
    if(previousLayers.length >= 1 ) {
        L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: ['a','b','c']
        }).addTo( map );
    }
    var wind  = L.tileLayer( 'https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid=484cfe59559077c9f0665bc7cb8ad793', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    layer: 'wind_new',
    subdomains: ['a','b','c']
    }).addTo( map );
    wind.addTo( map );
    previousLayers.push(wind);
}

function getPrecipitation() {
    map.off('click');
    $(".leaflet-marker-icon").remove();
    $(".leaflet-marker-shadow").remove();
    if(previousLayers.length >= 1 ) {
        
        L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: ['a','b','c']
        }).addTo( map );
    }
    var rain = L.tileLayer( 'https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid=484cfe59559077c9f0665bc7cb8ad793', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    layer: 'precipitation_new',
    subdomains: ['a','b','c']
    }).addTo( map );
    rain.addTo( map );
    previousLayers.push(rain);
}
