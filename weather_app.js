//getting device location by default from users device if location is on or ask for location if location is not on and then get location from
let lat;
let lon;
const successCallback = function (position) {
  initMap(position.coords.latitude, position.coords.longitude);
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  // console.log(lat, lon)
  getWeather();
  getWeekForcast();
};
const errorCallback = function (error) {
  // console.log(error);
  locationError();
  initMap(27.8913, 78.0792);
};
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
//End of getting device location.

//Starting of MAP Part.
//map.js

//Set up some of our variables.
var map; //Will contain map object.
var marker = false; ////Has the user plotted their location marker?

//Function called to initialize / create the map.
//This is called when the page has loaded.
function initMap(lat, long) {
  //The center location of our map.
  var centerOfMap = new google.maps.LatLng(lat, long);

  //Map options.
  var options = {
    center: centerOfMap, //Set center.
    zoom: 5, //The zoom value.
  };

  //Create the map object.
  map = new google.maps.Map(document.getElementById("map"), options);

  //Listen for any clicks on the map.
  google.maps.event.addListener(map, "click", function (event) {
    //Get the location that the user clicked.
    var clickedLocation = event.latLng;
    //If the marker hasn't been added.
    if (marker === false) {
      //Create the marker.
      marker = new google.maps.Marker({
        position: clickedLocation,
        map: map,
        draggable: true, //make it draggable
      });
      //Listen for drag events!
      google.maps.event.addListener(marker, "dragend", function (event) {
        markerLocation();
      });
    } else {
      //Marker has already been added, so just change its location.
      marker.setPosition(clickedLocation);
    }
    //Get the marker's location.
    markerLocation();
  });
}

//This function will get the marker's current location and then add the lat/long
//values to our textfields so that we can save the location.
function markerLocation() {
  //Get location.
  var currentLocation = marker.getPosition();
  //Add lat and lng values to a field that we can save.
  lat = currentLocation.lat(); //latitude
  lon = currentLocation.lng(); //longitude
  getWeekForcast();
  getWeather();
}

//End of The MAP Part

async function getWeather() {
  try {
    let city = document.getElementById("city").value;

    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=49988ce2d6ee669aa10d49a1f9e77e78&units=metric`
    );

    let data = await response.json();
    showWeather(data);
    // console.log(data);
  } catch (err) {
    console.log("err: ", err);
  }
}

let data_div = document.getElementById("data_div");
let cityMapDiv = document.getElementById("div1");
function showWeather(data) {
  cityMapDiv.innerHTML = "";
  let cityMap = document.createElement("iframe");
  cityMap.setAttribute("id", "cityMap");
  cityMap.setAttribute("loading", "lazy");
  cityMap.src = `https://www.google.com/maps/embed/v1/place?q=${data.name}&key=AIzaSyC5bwreCZGKc3hKUdkfd_3TEfmSoN9OfNY`;

  cityMapDiv.appendChild(cityMap);

  data_div.innerHTML = "";

  let temp = document.createElement("h2");
  temp.innerHTML = `Temperature:- ${data.main.temp} °C`;

  let pressure = document.createElement("h2");
  pressure.innerHTML = `Pressure:- ${data.main.pressure} Pa`;

  let humidity = document.createElement("h2");
  humidity.innerHTML = `Humidity:- ${data.main.humidity} g/m^3`;

  let windSpeed = document.createElement("h2");
  windSpeed.innerHTML = `Wind Speed:- ${data.wind.speed} m/s`;

  data_div.append(temp, pressure, humidity, windSpeed);
}

function locationError() {
  cityMapDiv.innerHTML = `<h2 style="color:red">Location Error</h2>`;
  document.getElementById(
    "data_div"
  ).innerHTML = `<h2 style="color:red">Location Error</h2>
        <h2>Please Enable Your Location or you can select location and search for city</h2>`;
}

//show week dforcast data.

async function getWeekForcast() {
  // console.log(lat)
  // console.log(lon)
  try {
    let city = document.getElementById("city").value;

    let res = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=49988ce2d6ee669aa10d49a1f9e77e78&units=metric`
    );

    let data = await res.json();

    // console.log(data);
    showWeekData(data.daily);
  } catch (err) {
    console.log(err);
  }
}

let weekData = document.getElementById("weekData");
function showWeekData(arr) {
  //for setting day of data
  let days = {
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
    7: "Sun",
  };
  let date = new Date();
  let day = date.getDay();
  // console.log(days[day]);

  weekData.innerHTML = "";
  arr.forEach((element) => {
    //pushing day in data
    if (day === 8) {
      day = 1;
    }
    element.day = days[day];
    day++;
    //ending of pushing day task;

    let div = document.createElement("div");
    div.setAttribute("class", "dayDiv");

    let h3 = document.createElement("h3");
    h3.innerHTML = element.day;

    let img = document.createElement("img");
    if (element.weather[0].main === "Rain") {
      img.src =
        "https://www.transparentpng.com/thumb/weather-report/cloud-dark-rain-icon-png-3.png";
    }
    if (element.weather[0].main === "Clear") {
      img.src =
        "https://library.kissclipart.com/20181005/uew/kissclipart-sunshine-weather-icon-clipart-computer-icons-weath-0526af0fcaed8dd7.png";
    }
    if (element.weather[0].main === "Clouds") {
      img.src = "https://cdn-icons-png.flaticon.com/128/1163/1163657.png";
    }
    if (element.weather[0].main === "Snow") {
      img.src =
        "https://www.pngkit.com/png/full/2-20182_snowfall-png-pic-snowy-weather-clip-art.png";
    }

    let maxTemp = document.createElement("p");
    maxTemp.innerHTML = `<b>${element.temp.max} °C</b>`;

    let minTemp = document.createElement("p");
    minTemp.innerHTML = `<b>${element.temp.min} °C</b>`;

    div.append(h3, img, maxTemp, minTemp);
    weekData.appendChild(div);
  });
  console.log(arr);
}

//function calling after click on button
async function mainGetWeather() {
  let city = document.getElementById("city").value;
  try {
    let cityDetails = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=49988ce2d6ee669aa10d49a1f9e77e78&units=metric`
    );

    let data = await cityDetails.json();
    lat = data.coord.lat;
    lon = data.coord.lon;
    getWeather();
    getWeekForcast();
  } catch (err) {
    console.log(err);
  }
}