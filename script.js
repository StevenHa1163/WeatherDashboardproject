

var city="";
// =$("#")
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var clearButton =$("#clear-history");
var currentCity =$("#current-city");
var currentTemperature =$("#temperature");
var currentHumidity =$("#humidity")
var currentWSpeed =$("#wind-speed");
var currentUvindex =$("#uv-index");
var sCity=[];

function find(c){
    for (var i=0; i<sCity.length; i++){
        if(c.toUpperCase()===sCity[i]){
            return -1
        }
    }
    return 1;
}

var APIKey = "a0aca8a89948154a4182dcecc780b513";

function displayWeather(event){
    event.preventDefault();
    if(searchCity.val().trim()!==""){
        city=searchCity.val().trim();
        currentWeather(city);
    }
}

function currentWeather(city){
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){
        console.log(response);
        var weathericon = response.weather[0].icon;
        var iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        var date = new Date(response.dt*1000).toLocaleDateString();
        $(currentCity).html(response.name +"("+date+")" + "<img src="+iconurl+">" );

        var tempF = (response.main.temp -273.15) * 1.80 + 32;
        $(currentTemperature).html((tempF).toFixed(2)+"&#8457");
        $(currentHumidity).html(response.main.humidity+"%");

        var ws=response.wind.speed;
        var windsmph=(ws*2.237).toFixed(1);
        $(currentWSpeed).html(windsmph+"MPH");

        UVIndex(response.coord.lon,response.coord.lat);
        if(response.cod==200){
            sCity=JSON.parse(localStorage.getItem("cityname"));
            console.log(sCity);
            if(sCity==null){
                sCity=[];
                sCity.push(city.toUpperCase());
                localStorage.setItem("cityname",JSON.stringify(sCity));
                
            }else{
                if(find(city)>0){
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(sCity));
                }
            }
        }
    });
}


function UVIndex(ln,lt){
    var uvqURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lt+"&lon="+ln;
    $.ajax({
            url:uvqURL,
            method:"GET"
            }).then(function(response){
                $(currentUvindex).html(response.value);
            });
}

$("#search-button").on("click",displayWeather);