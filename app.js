
var longitude = 0.0;
var latitude = 0.0;
var arrayStack = [];


$(document).ready(function () {

    if (localStorage.getItem("userInputarray") == null) {
        $("#currentCity").hide();
    } else {
        $("#currentCity").show();
        var cities = localStorage.getItem("userInputarray").split(',');
        for (i = 0; i < cities.length; i++) {
            console.log("Cities inside trim" + cities[i].replace(/ /g, ''));
            $(".place").append(`<button id="${cities[i].replace(/ /g, '')}" class="list-group-item">${cities[i]}</button>`);
            $("#" + cities[i].replace(/ /g, '')).on("click", function (e) {
                e.preventDefault();
                console.log("Cities inside for loop" + $("#" + this.id).text());
                $("#userInput").val($("#" + this.id).text());
                searchButtonEventfunction(e);
            });
        }
        var cities = localStorage.getItem("userInputarray").split(',');

        var lastSearchedCity = cities.pop();
        var lastSearchCityID = lastSearchedCity.replace(/ /g, '');
        console.log("last searched city" + lastSearchCityID);
        $("#" + lastSearchCityID).trigger('click');

        // <li id="sfo" class="list-group-item">San Francisco</li>

    }

    $("#searchBtn").on("click", searchButtonEventfunction);

    // <h5 id="forecastH5" class="row mt-4">5-Day Forecast:</h5>






});
function searchButtonEventfunction(e) {
    var Date = moment().format('L');
    var userInput = "";
    var apikey = "4d85d6dbdaa6d7aa09bd438d0f2b4745";
    console.log("inside search btn");
    e.preventDefault();
    $("#currentCity").show();
    var userInput = $("#userInput").val();
    while (userInput == "") {
        userInput = prompt("Please specify the city");
    }

    if (localStorage.getItem("userInputarray") == null) {
        arrayStack.push(userInput);
        localStorage.setItem("userInputarray", arrayStack);
    } else {
        var cities = localStorage.getItem("userInputarray").split(',');
        if (cities.indexOf(userInput) !== -1) {

            var index = cities.indexOf(userInput);
            cities.splice(index, 1);

        }
        cities.push(userInput);
        localStorage.setItem("userInputarray", cities);
    }


    $("#userInput").val("");
    $("#forecast").remove();
    $("#cloudIcon").remove();
    $("#forecastH5").remove();
    $.ajax({
        type: "GET",
        url: `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=${apikey}`,
        dataType: "json",
    }).then(function (response) {
        var kelvin = parseInt(response.main.temp);
        var fahrenheit = ((kelvin - 273.15) * 9) / 5 + 32;

        longitude = response.coord.lon;
        latitude = response.coord.lat;

        console.log(response);
        console.log(response.name);
        console.log(fahrenheit);
        console.log(response.main.humidity);
        console.log(response.wind.speed);
        console.log(response.coord.lat);
        console.log(response.coord.lon);

        $("#City").text(response.name + "( " + Date + " )");
        $(".definecity").append(`<div id="cloudIcon" class="col-sm-6"  style="width: 30rem;">
        <img src="http://openweathermap.org/img/w/${response.weather[0].icon}.png"
            class="card-img-top" alt="...">
    </div>`);
        $("#Temperature").text("Temperature :  " + fahrenheit + "°F");
        $("#Humidity").text("Humidity :  " + response.main.humidity + "%");
        $("#WindSpeed").text("Wind Speed :  " + response.wind.speed + "mph");
        $("#UVIndexLabel").text("UV Index : ");



        $.ajax({
            type: "GET",
            url: `https://api.openweathermap.org/data/2.5/uvi?appid=${apikey}&lat=${latitude}&lon=${longitude}`,
            dataType: "json",
        }).then(function (responseuv) {
            console.log(responseuv);
            console.log(responseuv.value);
            $("#UVIndex").text(responseuv.value);

            if (responseuv.value <= 2) {
                $("#UVIndex").attr("class", "col-1 favorable");
            }
            else if (responseuv.value <= 7) {
                $("#UVIndex").attr("class", "col-1 moderate");
            }
            else {
                $("#UVIndex").attr("class", "col-1 severe");
            }

        });
        $(".weather").append(`<h5 id="forecastH5" class="row mt-4 mb-4">5-Day Forecast:</h5>`);
        $(".weather").append(`<div id="forecast" class="row align-items-end mt-5">
     
            </div>`);

        $.ajax({
            type: "GET",
            url: `https://api.openweathermap.org/data/2.5/forecast/?q=${userInput}&appid=${apikey}&units=imperial&count=5`,
            dataType: "json",
        }).then(function (responseForecast) {
            var forecastArray = responseForecast.list;
            for (i = 0; i < forecastArray.length; i = i + 8) {
                console.log(forecastArray[i]);
                var dateString = forecastArray[i].dt_txt.split(" ")[0];
                var dateString1 = dateString.split("-");
                var finalDatestring = dateString1[1] + "/" + dateString1[2] + "/" + dateString1[0];
                console.log(dateString1);

                $("#forecast").append(`<div class="card ml-4 col-2 bg-primary" style="width: 18rem;>
                        <div class="card-body">
                            <h5 class="card-title">${finalDatestring}</h5>
                            <img src="http://openweathermap.org/img/w/${forecastArray[i].weather[0].icon}.png" class="card-img-top" alt="...">
                            <p class="card-text">Temp :${forecastArray[i].main.temp}°F</p>
                            <p class="card-text1">Humidity :${forecastArray[i].main.humidity}%</p>
                        

                        </div>
                    </div>`);
            }

        })

    })
    console.log('value is ' + $("#" + userInput.replace(/ /g, '')).text());
    var valueFromHtml = $("#" + userInput.replace(/ /g, '')).text();
    console.log('userInput is ' + userInput);

    if (valueFromHtml != userInput) {
        $(".place").append(`<button id="${userInput.replace(/ /g, '')}" class="list-group-item">${userInput}</button>`);
        $("#" + userInput.replace(/ /g, '')).on("click", function (e) {

            e.preventDefault();
            console.log("Cities inside for loop" + $("#" + this.id).text());
            $("#userInput").val($("#" + this.id).text());
            searchButtonEventfunction(e);
        });
    }
}
