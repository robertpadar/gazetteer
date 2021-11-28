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
                    if(result['data']['status']) {
                        alert("No data found");
                    }
                    var stationName = result['data']['weatherObservation']['stationName'];
                    var countryCode = result['data']['weatherObservation']['countryCode'];
                    var temperature = result['data']['weatherObservation']['temperature'];
                    var cloudsCode = result['data']['weatherObservation']['cloudsCode'];
                    var clouds = result['data']['weatherObservation']['clouds'];
                    var datetime = result['data']['weatherObservation']['datetime'];
                    var weather = result['data']['weatherObservation']['weatherCondition'];
                    var weatherCondition = " ";
                    if(weather == "n/a") {
                    } else {
                        weatherCondition += weather;
                    }
                    const d = new Date(datetime);
                    let dayInNum = d.getDay();
                    let day = [];
                    if(dayInNum == "1") {day.push("Monday")}
                    if(dayInNum == "2") {day.push("Tuesday")}
                    if(dayInNum == "3") {day.push("Wednesday")}
                    if(dayInNum == "4") {day.push("Thursday")}
                    if(dayInNum == "5") {day.push("Friday")}
                    if(dayInNum == "6") {day.push("Saturday")}
                    if(dayInNum == "7") {day.push("Sunday")}
                    if(weatherCondition.includes("snow")) {
                        var popup = L.popup({
                        className: 'weather-popup',
                        //offset: [180, 250]
                        })
                       .setContent('<div class="container-fluid mx-auto">' +
                       '<div class="row d-flex justify-content-center px-3">' +
                           '<div class="card snow">' +
                           '<h2 class="ml-auto mr-4 mt-3 mb-0">' + stationName + 
                           '&nbsp;&nbsp;' + countryCode + '</h2>' +
                           '<p class="ml-auto mr-4 mb-0 med-font">' + clouds + '</p>' +
                           '<h1 class="ml-auto mr-4 large-font">' + temperature + '&#176;</h1>' +
                           '<p class="time-font mb-0 ml-4 mt-auto">' + datetime.slice(11,16) +
                           '<p class="ml-4 mb-4">'+ day + '&nbsp;&nbsp;' + datetime.slice(0, 11) + '</p>' +
                               '</div>)' +
                           '</div>' +
                        '</div>')
                    }
                    if(cloudsCode == "BKN" || cloudsCode == "FEW" ||  cloudsCode == "CAVOK" ||   cloudsCode == "SCT" || cloudsCode == "NSC") {
                        if(weatherCondition.includes("snow")) {
                            var popup = L.popup({
                            className: 'weather-popup',
                            //offset: [180, 250]
                            })
                           .setContent('<div class="container-fluid mx-auto">' +
                           '<div class="row d-flex justify-content-center px-3">' +
                               '<div class="card snow">' +
                               '<h2 class="ml-auto mr-4 mt-3 mb-0">' + stationName + 
                               '&nbsp;&nbsp;' + countryCode + '</h2>' +
                               '<p class="ml-auto mr-4 mb-0 med-font">' + clouds + ', snow</p>' +
                               '<h1 class="ml-auto mr-4 large-font">' + temperature + '&#176;</h1>' +
                               '<p class="time-font mb-0 ml-4 mt-auto">' + datetime.slice(11,16) +
                               '<p class="ml-4 mb-4">'+ day + '&nbsp;&nbsp;' + datetime.slice(0, 11) + '</p>' +
                                   '</div>)' +
                               '</div>' +
                            '</div>')
                        } else if(weatherCondition.includes("rain")) {
                            var popup = L.popup({
                            className: 'weather-popup',
                            //offset: [180, 250]
                            })
                           .setContent('<div class="container-fluid mx-auto">' +
                           '<div class="row d-flex justify-content-center px-3">' +
                               '<div class="card rain">' +
                               '<h2 class="ml-auto mr-4 mt-3 mb-0">' + stationName + 
                               '&nbsp;&nbsp;' + countryCode + '</h2>' +
                               '<p class="ml-auto mr-4 mb-0 med-font">' + clouds + ', rain</p>' +
                               '<h1 class="ml-auto mr-4 large-font">' + temperature + '&#176;</h1>' +
                               '<p class="time-font mb-0 ml-4 mt-auto">' + datetime.slice(11,16) +
                               '<p class="ml-4 mb-4">'+ day + '&nbsp;&nbsp;' + datetime.slice(0, 11) + '</p>' +
                                   '</div>)' +
                               '</div>' +
                            '</div>')
                        } else {
                            var popup = L.popup({
                                className: 'weather-popup',
                                //offset: [180, 250]
                            })
                            .setContent('<div class="container-fluid mx-auto">' +
                            '<div class="row d-flex justify-content-center px-3">' +
                                '<div class="card clouds">' +
                                    '<h2 class="ml-auto mr-4 mt-3 mb-0">' + stationName + 
                                    '&nbsp;&nbsp;' + countryCode + '</h2>' +
                                    '<p class="ml-auto mr-4 mb-0 med-font">' + clouds + '</p>' +
                                    '<h1 class="ml-auto mr-4 large-font">' + temperature + '&#176;</h1>' +
                                    '<p class="time-font mb-0 ml-4 mt-auto">' + datetime.slice(11,16) +
                                    '<p class="ml-4 mb-4">'+ day + '&nbsp;&nbsp;' + datetime.slice(0, 11) + '</p>' +
                                    '</div>)' +
                                '</div>' +
                            '</div>')
                        }
                    }
                    if(cloudsCode == "OVC") {
                        if(weatherCondition.includes("snow")) {
                            var popup = L.popup({
                            className: 'weather-popup',
                            //offset: [180, 250]
                            })
                           .setContent('<div class="container-fluid mx-auto">' +
                           '<div class="row d-flex justify-content-center px-3">' +
                               '<div class="card snow">' +
                               '<h2 class="ml-auto mr-4 mt-3 mb-0">' + stationName + 
                               '&nbsp;&nbsp;' + countryCode + '</h2>' +
                               '<p class="ml-auto mr-4 mb-0 med-font">' + clouds + ', snow</p>' +
                               '<h1 class="ml-auto mr-4 large-font">' + temperature + '&#176;</h1>' +
                               '<p class="time-font mb-0 ml-4 mt-auto">' + datetime.slice(11,16) +
                               '<p class="ml-4 mb-4">'+ day + '&nbsp;&nbsp;' + datetime.slice(0, 11) + '</p>' +
                                   '</div>)' +
                               '</div>' +
                            '</div>')
                        } else if(weatherCondition.includes("rain")) {
                            var popup = L.popup({
                            className: 'weather-popup',
                            //offset: [180, 250]
                            })
                           .setContent('<div class="container-fluid mx-auto">' +
                           '<div class="row d-flex justify-content-center px-3">' +
                               '<div class="card rain">' +
                               '<h2 class="ml-auto mr-4 mt-3 mb-0">' + stationName + 
                               '&nbsp;&nbsp;' + countryCode + '</h2>' +
                               '<p class="ml-auto mr-4 mb-0 med-font">' + clouds + ', rain</p>' +
                               '<h1 class="ml-auto mr-4 large-font">' + temperature + '&#176;</h1>' +
                               '<p class="time-font mb-0 ml-4 mt-auto">' + datetime.slice(11,16) +
                               '<p class="ml-4 mb-4">'+ day + '&nbsp;&nbsp;' + datetime.slice(0, 11) + '</p>' +
                                   '</div>)' +
                               '</div>' +
                            '</div>')
                        } else {
                            var popup = L.popup({
                                className: 'weather-popup',
                                //offset: [180, 250]
                            })
                            .setContent('<div class="container-fluid mx-auto">' +
                            '<div class="row d-flex justify-content-center px-3">' +
                                '<div class="card overcast">' +
                                    '<h2 class="ml-auto mr-4 mt-3 mb-0">' + stationName + 
                                    '&nbsp;&nbsp;' + countryCode + '</h2>' +
                                    '<p class="ml-auto mr-4 mb-0 med-font">' + clouds + '</p>' +
                                    '<h1 class="ml-auto mr-4 large-font">' + temperature + '&#176;</h1>' +
                                    '<p class="time-font mb-0 ml-4 mt-auto">' + datetime.slice(11,16) +
                                    '<p class="ml-4 mb-4">'+ day + '&nbsp;&nbsp;' + datetime.slice(0, 11) + '</p>' +
                                    '</div>)' +
                                '</div>' +
                            '</div>')
                        }
                    }
                    if(cloudsCode == "Mist") {
                        var popup = L.popup({
                            className: 'weather-popup',
                            //offset: [180, 250]
                        })
                        .setContent('<div class="container-fluid mx-auto">' +
                        '<div class="row d-flex justify-content-center px-3">' +
                            '<div class="card mist">' +
                            '<h2 class="ml-auto mr-4 mt-3 mb-0">' + stationName + 
                            '&nbsp;&nbsp;' + countryCode + '</h2>' +
                            '<p class="ml-auto mr-4 mb-0 med-font">' + clouds + '</p>' +
                            '<h1 class="ml-auto mr-4 large-font">' + temperature + '&#176;</h1>' +
                            '<p class="time-font mb-0 ml-4 mt-auto">' + datetime.slice(11,16) +
                            '<p class="ml-4 mb-4">'+ day + '&nbsp;&nbsp;' + datetime.slice(0, 11) + '</p>' +
                                '</div>)' +
                            '</div>' +
                        '</div>')
                    }
                    if(cloudsCode == "Clear" || clouds == "n/a" || cloudsCode == "NCD") {
                        var popup = L.popup({
                            className: 'weather-popup',
                            //offset: [180, 250]
                        })
                        .setContent('<div class="container-fluid mx-auto">' +
                        '<div class="row d-flex justify-content-center px-3">' +
                            '<div class="card clear-sky">' +
                            '<h2 class="ml-auto mr-4 mt-3 mb-0">' + stationName + 
                            '&nbsp;&nbsp;' + countryCode + '</h2>' +
                            '<p class="ml-auto mr-4 mb-0 med-font">Clear Sky</p>' +
                            '<h1 class="ml-auto mr-4 large-font">' + temperature + '&#176;</h1>' +
                            '<p class="time-font mb-0 ml-4 mt-auto">' + datetime.slice(11,16) +
                            '<p class="ml-4 mb-4">'+ day + '&nbsp;&nbsp;' + datetime.slice(0, 11) + '</p>' +
                                '</div>)' +
                            '</div>' +
                        '</div>')
                    }
                    
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
