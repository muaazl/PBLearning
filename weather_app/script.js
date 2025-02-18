const url = 'https://api.openweathermap.org/data/2.5/weather'
const apiKey = '{apikeyhere}'

$(document).ready(function () {
    weatherFn('Colombo')
})

async function weatherFn(cName) {
    const apiURL = `${url}?q=${cName}&appid=${apiKey}&units=metric`;
    try {
        const res = await fetch(apiURL);
        const data = await res.json();
        console.log(data);  // Log the response to verify

        if (res.ok) {
            weatherShowFn(data);
            showCityTime(data);
        } else {
            alert("City not found. Please try again.");
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

function weatherShowFn(data) {
    $('#city-name').text(data.name);
    $('#temperature').html(`${data.main.temp}°C`);
    $('#description').text(data.weather[0].description);
    $('#wind-speed').html(`Wind Speed: ${data.wind.speed} m/s`);
    $('#weather-icon').attr('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
    $('#weather-info').fadeIn();
}

function showCityTime(data) {
    const timezoneOffset = data.timezone; // Timezone offset in seconds
    const localTime = moment().utcOffset(timezoneOffset / 60); // Convert the timezone offset to minutes
    $('#date').text(localTime.format('MMMM Do YYYY, h:mm:ss a')); // Format the time
}

$('#city-input-btn').click(function () {
    const city = $('#city-input').val();
    if (city) weatherFn(city);
});
