var apiKey = '5871e129d3e74bfe77aa47dee5c6f7a3';

function searchHistory() {
    localStorage.setItem("cities", JSON.stringify(cities));
};

searchHistory = JSON.parse(localStorage.getItem("cities"));

if (searchHistory) {
    city=searchHistory[0].name;
    window.onload=weatherCall(city)
    console.log(searchHistory)
};

$("#searchButton").on('click', function() {
    city = $(this).parent("div").children("div").children("input").val();
    $(this).parent("div").children("div").children("input").val("");
    weatherCall();
})

function weatherCall() {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    $.ajax({
        url: queryURL,
        method: "GET",
    })
        .then(function (response) {
            var iconCode = response.weather[0].icon;
            var iconURL = "http://openweathermap.org/img/w/" + iconCode +".png";

            cityObject = {
                name: response.name
            }

            cityArray = JSON.parse(localStorage.getItem("cities"));
            if (cityArray === null) {
                localStorage.setItem("cities", JSON.stringify([cityObject]));
            } else {
                function listCleaner() {
                    for (i=0; i < cityArray.length; i++) {
                        if (cityArray[i].name === cityObject.name) {
                            removedCity = cityArray.splice([i], 1);
                        };
                    }

                    cityArray.unshift(cityObject);

                    localStorage.setItem("cities", JSON.stringify(cityArray));
                }
            }   if (cityArray !==null) {
                listCleaner();
            }

            $(".city").text(response.name);
            $(".temp").text("Temperature: " + response.main.temp + "F");
            $(".humidity").text("Humidity: " + response.main.humidity + "%");
            $(".windSpeed").text("Wind Speed: " + response.wind.speed + "MPH");
            $("#icon").attr('src', iconURL)
            cityLat = response.coord.lat;
            cityLon = response.coord.lon;
            cityId = response.id;

            //how to get UV Index
            var uviURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${cityLat}&lon=${cityLon}&units=imperial`;
            $.ajax({
                url: uviURL,
                method: "GET",
            })
                .then(function (response) {
                    $(".uvIndex").text("UV Index: " + response.value);

                    //set UV Index colors
                    if (response.value <= 2){
                        $('.uvIndex').css('background-color', '##008000');
                    } else if (response.value >2 && response.value <= 5) {
                        $('.uvIndex').css('background-color', '#FFFF00');
                    } else if (response.value >5 && response.value <= 7) {
                        $('.uvIndex').css('background-color', '#FF4500');
                    } else if (response.value >7 && response.value <= 10) {
                        $('.uvIndex').css('background-color', '#D1394A');
                    } else if (response.value >10) {
                        $('.uvIndex').css('background-color', '#FF0000');
                    }

                })

                //how to get the five day forecast
                var fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&id=${cityId}&units=imperial`;

                $.ajax({
                    url: fiveDayURL,
                    method: "GET",
                })
                .then(function (response){
                    for (var i = 0; i <response.list.length; i += 8) {
                        var iconCode = response.list[i].weather[0].icon;
                        var iconURL = "http://openweathermap.org/img/w/" + iconCode +".png";
                        $("#temp-" + i).text("Temp: " + response.list[i].main.temp + "F");
                        $("#humid-" + i).text("Humidity: " + response.list[i].main.humidity + "%");
                        $("#icon-" + i).attr('src', iconURL);
                    }
                })
        })
};

$(document).on('click', function() {
    city=$(this).text();
    weatherCall();
})