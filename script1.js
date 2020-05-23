$(document).ready(function () {
    $("#button-addon2").click(function(){
      var city = "london";
      var APIKey = "438d21396eadb2777d54f41c8be79e21";
      var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
      console.log (queryURL)
      $.ajax({
          url: queryURL,
          method: "GET",
          datatype: "JSON"
        })
        .then(function(response) {
          // Transfer content to HTML]
          console.log(response)
          console.log(response.city.name)
          console.log("<h1>" + response.city.name + " Weather Details</h1>")
          var title = $(".card-body-main").html("<h1>" + response.city.name + "Weather Details</h1>");
          console.log(title);
          var humidity = $(".card-body-main").text("Humidity: " + response.city.humidity);
          // $(".wind").text("Wind Speed: " + response.wind.speed);
          // Convert the temp to fahrenheit
          var tempF = (response.list[0].main.temp - 273.15) * 1.80 + 32;
          var temp = $(".card-body-main").text("Temp: " + tempF);
          // add temp content to html
          title.append(".card-body-main");
          // $(".tempF").text("Temperature (F) " + tempF.toFixed(2));
        });
      });
  });