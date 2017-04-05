$(document).ready(function() {
  weatherApp = {
    $targetArea: $("#weather"),
    weatherApiKey: "",
    lastLatitiude: "",
    lastLongitude: "",
    getFormData: function() {
      if (weatherApp.weatherApiKey === null || weatherApp.weatherApiKey === "") {
        weatherApp.weatherApiKey = $("#apikey").val().trim();
      }
      let zip = $("#zip").val().trim();
      if (zip === null || zip.length < 5) {
        weatherApp.$targetArea.html("Enter a valid zip code.");
      } else {
        weatherApp.getWeatherData(zip);
      }
    },
    getWeatherData: function(zipcode) {
      // let url = "//api.openweathermap.org/data/2.5/weather?zip=" + zipcode + ",us&appid=" + weatherApp.weatherApiKey + "&units=imperial";
      let url = "testData/test.json";
      $.getJSON(url, function(data) {
        if (data.cod == 200) {
          weatherApp.$targetArea.html("Success!");
          let str = ``;
          // THIS IS WHERE YOU WOULD ADD THE DATA TO THE PAGE
          // Add the city name
          let city = data.name;
          str += `<h2>${city}'s Forecast</h2><div class="card"><h3>Today</h3><p style="text-transform: capitalize;">`;
          // Add the weather condition descriptions, all of them, comma separated
          for (let i in data.weather) {
            let description = data.weather[i].description;
            if (i < data.weather.length - 1) {
              str += `${description}, `;
            } else {
              str += `${description}.</p>`;
            }
          }
          // Add the current temperature, the day's low & high temp, current pressure, & current humidity
          let temp = Math.floor(data.main.temp),
            low = Math.floor(data.main.temp_min),
            high = Math.floor(data.main.temp_max + 0.5),
            pressure = data.main.pressure,
            humidity = data.main.humidity;
          str += `<ul><li>Current temperature: ${temp}&deg;F</li>
          <li>High: ${high}&deg;F</li><li>Low: ${low}&deg;F</li>
          <li>Pressure: ${pressure} in</li><li>Humidity: ${humidity}%</li></ul></div>`;
          // Get the lat & longitude from the result and save
          weatherApp.lastLatitiude = "???";
          weatherApp.lastLongitude = "???";
          // Add a button for 5 day forcast
          weatherApp.$targetArea.append('<div id="5day"><button id="fiveDay">Get 5 Day Forecast</button></div>');
          $("#fiveDay").on("click", weatherApp.getFiveDayWeather);
          $(`#weather`).append(str);
        } else {
          weatherApp.$targetArea.html("Sorry, no weather data available. Try again later.");
        }
      }).fail(function() {
        weatherApp.$targetArea.html("Sorry, no weather data available. Try again later.");
      });
    },
    getFiveDayWeather: function() {
      //let url = "//api.openweathermap.org/data/2.5/forecast?lat=" + weatherApp.lastLatitiude + "&lon=" + weatherApp.lastLongitude + "&appid=" + weatherApp.weatherApiKey + "&units=imperial";
      let url = "testData/test5day.json"
      $.getJSON(url, function(data) {
        let $target = $("#5day")
        if (data.cod == 200) {
          $target.html("Success!");
          // THIS IS WHERE YOU WOULD ADD THE 5 DAY FORCAST DATA TO THE PAGE
          let str = `<div>`;
          for (let i in data.list) {
            if (data.list[i].dt_txt.includes(`12:00:00`)) {
              let noonData = data.list[i];
              // For each of the 5 days, at each time specified, add the date/time plus:
              let day = noonData.dt_txt.substring(8, 10),
                month = noonData.dt_txt.substring(5, 7),
                year = noonData.dt_txt.substring(0, 4),
                date = `${month} - ${day}, ${year} at 12:00pm`;
              //   - the weather condition descriptions, all of them, comma separated
              str += `<div class="card"><h3>${date}</h3><p style="text-transform: capitalize;">`;
              for (let j in noonData.weather) {
                let description = noonData.weather[j].description;
                if (j < noonData.weather.length - 1) {
                  str += `${description}, `;
                } else {
                  str += `${description}.</p>`;
                }
              }
              //   - day's temp, low & high temp, pressure, humidity
              let temp = Math.floor(noonData.main.temp),
                low = Math.floor(noonData.main.temp_min),
                high = Math.floor(noonData.main.temp_max + 0.5),
                pressure = noonData.main.pressure,
                humidity = noonData.main.humidity;

              str += `<ul><li>Current temperature: ${temp}&deg;F</li>
              <li>High: ${high}&deg;F</li><li>Low: ${low}&deg;F</li>
              <li>Pressure: ${pressure} in</li><li>Humidity: ${humidity}%</li></ul></div>`;
              console.log(str);
            }
          }
          $(`#weather`).append(str);
        } else {
          $target.html("Sorry, 5 day forcast data is unavailable. Try again later.");
        }
      }).fail(function() {
        weatherApp.$targetArea.html("Sorry, 5 day forcast data is unavailable. Try again later.");
      });
    }
  }
  // Form submit handler
  $("#submit").click(function() {
    weatherApp.getFormData();
    return false;
  });
});
