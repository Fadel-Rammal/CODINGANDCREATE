async function getWeather() {
    const locationInput = document.getElementById('location');
    const location = locationInput.value;
    const apiKey = 'api goes here';
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === 200) {
        document.getElementById('result').innerHTML = `
            <h2>${data.name}, ${data.sys.country}</h2>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;
    } else {
        document.getElementById('result').innerHTML = `<p>${data.message}</p>`;
    }

    
    locationInput.value = '';
}


document.getElementById('location').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        getWeather();
    }
});


document.querySelector('.button').addEventListener('click', function() {
    getWeather();
});
