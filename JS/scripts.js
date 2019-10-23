(function () {
    //Submit button event handler
    $("#submit").click(function() {
        //Get the value the user has entered un the search bar and store it
        const searchLocation = $("#searchBar").val();
        //Call the geocode function and pass in the value
        geocode(searchLocation);
        //Clear out the search bar
        $("#searchBar").val("");
    });

     //When a button is clicked with the id of remove in the document, call the function
     $(document).on("click", "button#remove", function() {
        //get the parent element of the button
        let parentDiv = $(this).parent(); //this refers to the element that triggered the event hadler (in this case the buttton that was clicked)
        let weatherCardContainer = parentDiv.parent();
        //remove the container and all of its contents
        weatherCardContainer.remove();
    })
})();

//Function to connect to the Dark Aky API and get weather data
function getWeatherInfo(latitude, longitude, city, state) {

    //Base-URL/APIKey/Latitude,Longitude

    $.ajax("https://api.darksky.net/forecast/" + darkSkyKey + "/" + latitude + "," + longitude, { dataType: "jsonp"})
    .done(function(data) {
        //Get the HTML from the div with the ID template
        let templateHTML = $("#template").html();

        //We need to get the temp from Dark Sky data
         let temperature = data.currently.temperature;
         let conditions = data.currently.summary;
         let weatherIcon = data.currently.icon;

         let currentDayInfo = data.daily.data[0];

         let highTemp = currentDayInfo.temperatureHigh;
         let lowTemp = currentDayInfo.temperatureLow;
         let precipChance = currentDayInfo.precipProbability * 100;
        
        //Replace the string @@city@@ with the city we pass into this functiom in the HTML
        templateHTML = templateHTML.replace("@@city@@", city);

        //Replace the string "@@currentTemp@@' with the temperature we get back from the API call
        templateHTML = templateHTML.replace("@@currentTemp@@", Math.round(temperature));

        templateHTML = templateHTML.replace("@@cityState@@", city + " " + state);

        templateHTML = templateHTML.replace("@@conditions@@", conditions);

        templateHTML = templateHTML.replace("@@highTemp@@", Math.round(highTemp));

        templateHTML = templateHTML.replace("@@lowTemp@@", Math.round(lowTemp));

        templateHTML = templateHTML.replace("@@precip@@", Math.round(precipChance));

        templateHTML = templateHTML.replace("@@imageURL@@", getBackgroundPath(weatherIcon));

        for (var i=0; i<5; i++) {
            //Sett the date for each day
            if (i > 0) {
                let date = new Date();
                date.setDate(date.getDate() + i);

                //Get the month (0-11) from the data and add 1 to it for accuracy
                let month = date.getMonth() + 1;
                //Get the day from the data
                let day = date.getDate();
                
                //Replace the placeholder text in the template for date i
                templateHTML = templateHTML.replace("@@date" + i + "@@", month + "/" + day);
                
            }

            //Get the weather data for the day based on i
            let currentDayWeatherData = data.daily.data[i];

            templateHTML = templateHTML.replace("@@max" + i + "@@", Math.round(currentDayWeatherData.temperatureMax));
            templateHTML = templateHTML.replace("@@low" + i + "@@", Math.round(currentDayWeatherData.temperatureMin));
            templateHTML = templateHTML.replace("@@precip" + i + "@@", Math.round(currentDayWeatherData.precipProbability * 100));
        }

        //Add the configured template HTML to our row in the card container
        $(".row").append(templateHTML);

       
    })
    .fail(function(error) {
        console.log(error);
    })
    .always(function() {
        console.log("Weather call complete!");
    })
}


//Function to connect to the MapQuest Geocoding API and get geocoding data
function geocode(location) {

    //Base-URL + APIKey + &Location= + Address

    $.ajax("http://www.mapquestapi.com/geocoding/v1/address?key=" + mapQuestKey + "&location=" + location)
    .done(function(data) {
        //Get the lat and lng from the response
        let locations = data.results[0].locations[0];

        let lat = locations.latLng.lat;
        let lng = locations.latLng.lng;

        //Get city and state so we can display it to the user later
        let city = locations.adminArea5;
        let state = locations.adminArea3;

        //Pass the lat and lng to our getWeatherInfo function
        getWeatherInfo(lat, lng, city, state);
    })
    .fail(function(error) {
        console.log(error);
    })
    .always(function() {
        console.log("Geocoding call finished!");
    })
}

function getBackgroundPath(iconString) {
    switch (iconString) {
 
        case "clear-day":
            return "..//img/clear-day.jpg";
        case "clear-night":
            return "..//img/clear-night.jpg";
        case "cloudy":
            return "..//img/cloudy.jpg";
        case "fog":
            return "..//img/fog.jpg";
        case "partly-cloudy-day":
            return "..//img/partly-cloudy-day.jpg";
        case "partly-cloudy-night":
            return "..//img/partly-cloudy-night.jpg";
        case "rain":
            return "..//img/rain.jpg";
        case "sleet":
            return "..//img/sleet.jpg";
        case "snow":
            return "..//img/snow.jpg";
        case "wind":
            return "..//img/wind.jpg";
        default:
            return "..//img/clear-day.jpg";

    }
} 





