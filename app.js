const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs'); // set up ejs
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.render("weather");
});

app.post("/", function(req, res){
    // get info from form submitted
    let city = req.body.city;
    
    // get the data from weather api
    let cityUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city +"&appid=4622d68d2b8d0e693fa02cbc3e3ad945";

    // res.send("server is up and running!");
    // get city lat + lon from city name first 
    let cityData = https.get(cityUrl, function(response){
        // console.log(response.statusCode);

        // when we receive some data from api 
        response.on("data", function(data){
            // convert back to JSON first 
            const cityInfo = JSON.parse(data);
            const lat = cityInfo[0].lat;
            const lon = cityInfo[0].lon;
            
            const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon +"&appid=4622d68d2b8d0e693fa02cbc3e3ad945&units=metric";
            // get weather data with lat and lon
            let weatherData = https.get(weatherUrl, function(response){
                // console.log(response.statusCode);

                response.on("data", function(data){
                    const weatherInfo = JSON.parse(data);
                    // console.log(weatherInfo);
                    const temp = weatherInfo.main.temp;
                    const feel = weatherInfo.main.feels_like;
                    const temp_min = weatherInfo.main.temp_min;
                    const temp_max = weatherInfo.main.temp_max;
                    const humidity = weatherInfo.main.humidity;
                    const description = weatherInfo.weather[0].description;
                    const icon = weatherInfo.weather[0].icon;
                    const iconImg = "https://openweathermap.org/img/wn/"+ icon + "@2x.png"

                    res.render("report", {data: {city: city, description: description, temp: temp, iconImg: iconImg, humidity: humidity, temp_max: temp_max, temp_min: temp_min, feel: feel}} );

                });
            });
        });
    });
});




app.listen(3000, function(){
    console.log("server is running on port 3000!");
});