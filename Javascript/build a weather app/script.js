const url = 'https://api.openweathermap.org/data/2.5/weather'
const apiKey = '028dc1eee80e4a76830e8fbb0c6e9c0a'

$(document).ready(function () {
    weatherFn('Colombo')
})

async function weatherFn(cName) {
    const apiURL = `${url}?q=${cName}&appid=${apiKey}&units=metric`
    try {
        const res = await fetch(apiURL)
        const data = await res.json()
        if (res.ok) {
            weatherShowFn(data)
        } else {
            alert("City not found. Please try again.")
        }
    } catch (error) {
        console.error("Error fetching weather data:", error)
    }
}

function weatherShowFn(data) {
    $('#city-name').text(data.name);
    $('#date').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
    $('#temperature').html(`${data.main.temp}°C`);
    $('#description').text(data.weather[0].description);
    $('#wind-speed').html(`Wind Speed: ${data.wind.speed} m/s`);
    $('#weather-icon').attr('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
    $('#weather-info').fadeIn();
}

$('#city-input-btn').click(function () {
    const city = $('#city-input').val()
    if (city) weatherFn(city)
})