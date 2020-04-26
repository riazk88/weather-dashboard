var apiKey = '4299fae601db68837c525a5a1fca5e9e';
var citySearches = [];
var city 
var cityLat
var cityLon
var removedCity

storedCities = JSON.parse(localStorage.getItem("cities"));

if (storedCities !==null) {
    city = storedCities[0].name;
    window.onload = currentCall(city)
};

function renderList() {
    Object.values(storedCities).forEach((value) => {
        var $cityLi = $("<li>", {"class": "list-group-item"});
        $cityLi.text(value.name);
        $(".list-group").prepend($cityLi);
    }
    )
}

if (storedCities !==null) {
    renderList();
}

$("#searchButton").on('click', function() {
    city = $(this).parent("div").children("div").children("input").val();
    $(this).parent("div").children("div").children("input").val("");
    currentCall();
})

function currentCall() {
    fetch('http://api.openweathermap.org/data/2.5/weather?q=' + city + "&units=imperial&APPID=" + '4299fae601db68837c525a5a1fca5e9e')

        .then(function (response) {
            var $cityLi = $("<li>", {"class": "list-group-item"});
            // var iconCode = response.weather[0].icon;
            // var iconURL = "http://openweathermap.org/img/w/" + iconCode +".png";

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
                listCleaner();}

            $(".city").text(response.name);
            $(".temperature").text("Temperature: " + response.main.temp);
            $(".humidity").text("Humidity: " + response.main.humidity);
            $(".windSpeed").text("Wind Speed: " + response.wind.speed);
            $("#icon").attr('src', iconURL)
            cityLat = response.coord.lat;
            cityLon = response.coord.lon;
            cityID = response.id;

            fretch('http://api.openweathermap.org/data/2.5/uvi?' + "&APPID=" + '4299fae601db68837c525a5a1fca5e9e' + "&" + cityLat + "&" + cityLon)

                .then(function (response) {
                    $(".uvIndex").text("UVI: " + response.value);
                    var $dateHeader = $("<h2>");
                    $dateHeader.text(shortDate);
                    $("h1").append($dateHeader);
                })
            fetch('http://api.openweathermap.org/data/2.5/forecast?q=' + city + "&units=imperial&APPID=" + '4299fae601db68837c525a5a1fca5e9e')
 
                .then(function (response){
                    for (var i = 4; i <response.list.length; i += 8) {
                        var iconCode = response.list[i].weather[0].icon;
                        var iconURL = 'http://openweather.org/img/w/' + iconCode + ".png";
                        var shortDate = response.list[i].dt_text.substr(0, response.list[i].dt_txt.indexOf(' '));
                        $("#day-" + index).text(shortDate);
                        $("#temp-" + index).text("Temp: " + response.list[i].main.temp);
                        $("#humid-" + index).text("Humidity: " + response.list[i].main.humidity);
                        $("#icon-" + index).attr('src', iconURL);
                        index = index + 8;
                    }
                })
        })
};

$(document).on('click', "li", function() {
    city=$(this).text();
    currentCall();
});
// citySearches = localStorage.getItem("userInputStorage");
//     citySearches = JSON.parse(citySearches) || [];
//     renderSearchHx()
//     var userInput;

//     function displayWeather(cityName) {
//         var forecastURL = 'http://api.openweathermap.org/data/2.5/forecast?q=' + cityName + "&units=imperial&APPID=" + '4299fae601db68837c525a5a1fca5e9e';
//         var queryURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName + "&units=imperial&APPID=" + '4299fae601db68837c525a5a1fca5e9e';
        

//         $.ajax({
//             url: queryURL,
//             dataType: 'json',
//             method: 'GET',
//         })  .then(function (response) {
//             var cityLat = "lat=" + response.coord.lat;
//             var cityLon = "lon=" + response.coord.lon;
//             var uvIndexURL = "http://api.openweathermap.org/data/2.5/uvi?" + "&APPID=" + '4299fae601db68837c525a5a1fca5e9e' + "&" + cityLat + "&" + cityLon;

//             $.ajax ({
//                 url: uvIndexURL,
//                 method: 'GET',
//             }) .then(function (UVresponse) {
//                 $("#uvIndex").text("UV Index: " + UVresponse.value);
//             })
            
//             var citySearch = $("<p>").text(response.name + " (Today)");
//             var tempSearch = $("<p>").text("Temperature: " + response.main.temp + " F");
//             var humiditySearch = $("<p>").text("Humidity: " + response.main.humidity + "%");
//             var windSearch = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");

//             $("#cityName").empty();
//             $("#temperature").empty();
//             $("#humidity").empty();
//             $("#wind").empty();

//             $("#cityName").append(citySearch);
//             $("#temperature").append(tempSearch);
//             $("#humidity").append(humiditySearch);
//             $("#wind").append(windSearch);
//         });

//         $.ajax({
//             url: forecastURL,
//             method: "GET"
//         })

//             .then(function (response){
//                 displayWeather(response);
//             });
//     }

//     function displayWeather (response) {
//         var date
//     }

//     function addPreviousSearch() {
//         var btnPreviousSearch =$("<button>")
//         btnPreviousSearch.addClass("search list-group-item list-group-item-action");
//         btnPreviousSearch.attr("data-name", userInput);
//         btnPreviousSearch.text(userInput);
//         $(".previousSearchList").prepend(btnPreviousSearch);
//     }

//     function renderSearchHx() {
//         for (var i=0; i< citySearches.length; i++) {
//             var button =$("<button>");
//             button.addClass("search list-group-item list-group-item-action");
//             button.text(citySearches[i]);
//             $(".previousSearchList").prepend(button);
//         }
//     }

//     $(document).on('click', ".list-group-item-action", function (event){
//             event.preventDefault();
//             var pastSearchButton = $(this).text();
//             displayWeather(pastSearchButton);
//     })

//     $(".btn-success").on('click', function (event){
//             event.preventDefault();
//             userInput=$("#citySearch").val().trim();
//         if ((userInput === null) || (userInput === '')){
//             console.log("no input, ty again")
//             return;
//         } else {
//             citySearches.push(userInput);
//             localStorage.setItem("userInputStorage", JSON.stringify(citySearches));
//             displayWeather(userInput);
//             addPreviousSearch();
//         }
//     })

