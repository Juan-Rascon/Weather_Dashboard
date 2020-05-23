
// var currLocation;

// navigator.geolocation.getCurrentPosition(function(loc){
//     currLocation = loc.coords;
// });

var iconurl = "http://openweathermap.org/img/wn/";
var appid = "2bcb2442b31f149860a8858b827cc5f5";
var OneCall = "https://api.openweathermap.org/data/2.5/onecall?";
var firstCall = "https://api.openweathermap.org/data/2.5/weather?";
var units = "imperial";
var exclude ="hourly,minutely";
var q = "Westwood"; //city name
var lat; //latitude coordinates
var lon; //longitude coordinates
var params;
var DataObj;

$(document).ready(function(){

    CreateStorage();

    params={q,units,appid};
    UpdateSite();

    $("#button-addon2").click(function(event){
         event.preventDefault();

         //City is retrieved from input field
         q = capitalize_Words($("input").val());
         params ={q,units,appid};

         //Check if city is not blank value
         if (q !==""){
          UpdateSite($(this));
         }
          
    });

    $("#recentSearches").on("click", "button", function(event){
        event.preventDefault();

        q = event.target.textContent;
        params = {q,units,appid};
        UpdateSite($(this));
        })
});


function UpdateSite(target){
    $.when( 
        $.getJSON(firstCall + $.param(params), getData))
        .then(function(){
            $.getJSON(OneCall + $.param(params), setData)
            .then(function(){
                UpdateMainDiv(DataObj);
                UpdateForecast(DataObj);
                if (target.attr("id")){
                    addCity(q);
                    SaveCity(q);
                } 
                LastCitySearched(q); 
            })
        })
        .fail(function(){
            alert("Not found");
        })
};

function getData(response){
    lat = response.coord.lat;
    lon = response.coord.lon;
    params = {lat,lon,exclude,units, appid};
};

function capitalize_Words(str)
{
 return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function setData(response){
    DataObj = response;
};

function addCity(city){
    var newElem =  $("<div>");
    newElem.addClass("col border bg-white p-0");
    var btnElem = $("<button>").addClass("btn bg-white border-0 btn-block py-2 text-left")
    btnElem.text(city);
    newElem.append(btnElem);
    $("#recentSearches").append(newElem);
};

function UpdateMainDiv(obj){
    $("#mainCity").text(q + " " + GetStringDate(obj.current.dt));
    $("#mainIcon").attr("src", GetIconURL(obj,"current"));
    $("#mainTemp").text(obj.current.temp);
    $("#mainHum").text(obj.current.humidity);
    $("#mainWS").text(obj.current.wind_speed);
    $("#mainUVI").text(obj.current.uvi);
    $("#mainUVI").addClass(GetUVI(obj.current.uvi));
};

function UpdateForecast(obj){
    var forecast = obj.daily
    $(".card-title").each(function(index){
        $(this).text(GetStringDate(forecast[index+1].dt))
        $(this).siblings(".cardicon").children("img").attr("src", GetIconURL(forecast[index+1].weather[0].icon));
        $(this).siblings(".cardTemp").children("span:first-child").text(forecast[index+1].temp.day);
        $(this).siblings(".cardHum").children("span:first-child").text(forecast[index+1].humidity);
    }
    )
}

function GetStringDate(date){
    var date = new Date(date *1000);
    var strmonth = date.getMonth()+1 ; 
    var strday = date.getDate();     
    var stryear = date.getFullYear();
    var strDate = "("+strmonth+"/"+strday+"/"+stryear+")";
    return strDate
}
function GetUVI(uvi){
    if (uvi>=6){
        return "bg-danger";
    }
    else if (uvi<=5 && uvi>=3){
        return "bg-warning";
    }else 
    {
        return "bg-success";
    }

};

function GetIconURL(obj, day){
    if (day=="current"){
        return iconurl + obj.current.weather[0].icon +".png";
    }
    else {
        return iconurl + obj +".png";
    }

}
// Create a function that returns the current date
// function getLocation() {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(showPosition);
//     } else { 
//       x.innerHTML = "Geolocation is not supported by this browser.";
//     }
//   };

  function CreateStorage(){
    if (localStorage.getItem("CitiesSearch") === null){
      var CityObject = {};
      var LastCity;
      localStorage.setItem("CitiesSearch", JSON.stringify(CityObject));
      localStorage.setItem("LastCity", LastCity);
    }else{
        populateCities();
    }
  };
  function LastCitySearched(city){
    var Lastcity = localStorage.getItem("LastCity");
    Lastcity = city;
    localStorage.setItem("LastCity", Lastcity);
  };

  function SaveCity(city){
    var id = Date.now();
    var cities = JSON.parse(localStorage.getItem("CitiesSearch"));
    cities[id] = city;
    localStorage.setItem("CitiesSearch",JSON.stringify(cities));
  };

  function populateCities(){
    var cityList = JSON.parse(localStorage.getItem("CitiesSearch"));
    var Lastcity = localStorage.getItem("LastCity");
    q = Lastcity;
    params ={q,units,appid};
    UpdateSite();
    var cities = Object.values(cityList);
    for (var city of cities){
        addCity(city);
    }
    };