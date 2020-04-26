var apiKey = '5871e129d3e74bfe77aa47dee5c6f7a3';



$("#searchButton").on('click', function() {
    city = $(this).parent("div").children("div").children("input").val();
    $(this).parent("div").children("div").children("input").val("");
    currentCall();
})

function currentCall() {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    $.ajax({
        url: queryURL,
        method: "GET",
    })
        .then(function (response) {
            var $cityLi = $("<li>", {"class": "list-group-item"});
            var iconCode = response.weather[0].icon;
            var iconURL = "http://openweathermap.org/img/w/" + iconCode +".png";

            cityObject = response.name;

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

            var uviURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${cityLat}&lon=${cityLon}&units=imperial`;
            $.ajax({
                url: uviURL,
                method: "GET",
            })
                .then(function (response) {
                    $(".uvIndex").text("UV Index: " + response.value);
                    var $dateHeader = $("<h2>");
                    $dateHeader.text(shortDate);
                    $("h1").append($dateHeader);
                })
                var fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&id=${cityId}&units=imperial`;
                $.ajax({
                    url: fiveDayURL,
                    method: "GET",
                })
                .then(function (response){
                    for (var i = 0; i <response.list.length; i += 8) {
                        // var iconCode = response.list[i].weather[0].icon;
                        // var iconURL = 'http://openweather.org/img/wn/' + iconCode + ".png";
                        // var shortDate = response.list[i].dt_text.substr(0, response.list[i].dt_txt.indexOf(' '));
                        
                        $("#day-" + index).text(shortDate);
                        $("#temp-" + index).text("Temp: " + response.list[i].main.temp);
                        $("#humid-" + index).text("Humidity: " + response.list[i].main.humidity);
                        $("#icon-" + index).attr('src', iconURL);
                    }
                })
        })
};

$(document).on('click', "li", function() {
    city=$(this).text();
    currentCall();
})