import React, { useState, useEffect } from 'react';
import css from 'styles/Page';
import WeatherDay from './WeatherDay';

export default function App() {

  //Metaweather API is not returning Access-Control-Allow-Origin header, use proxy to add required header to response
  const PROXYURL = 'https://cors-anywhere.herokuapp.com/';
  const WEATHER_API = 'https://www.metaweather.com/api/location/2367105/';

  const GITURL = 'https://api.github.com/users/Agonzit';
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [showForecast, setShowForecast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function roundDecimalsFromString(string, decimals){
    return string.replace(/\d+\.\d+/g, function(match) {
      return Number(match).toFixed(decimals);
    })
  }

  function toggleForecast() {
    setShowForecast((showForecast) => !showForecast);
  }

  useEffect(() => {
    setLoading(true);
    fetch(`${PROXYURL}${WEATHER_API}`).then((response) => {

        if(!response.ok){
            throw new Error('Something went wrong');
        } else {
          return response.json();
        }
    })
    .then((data) => {
      let weatherToday = data.consolidated_weather[0];
      let latt_long_rounded = roundDecimalsFromString(data.latt_long, 2);

      setWeather({
        location: data.title +', ' + data.parent.title,
        latt_long: latt_long_rounded,
        weather_state: weatherToday.weather_state_name,
        weather_state_abbr: weatherToday.weather_state_abbr,
        current_temp: weatherToday.the_temp,
        min_temp: parseInt(weatherToday.min_temp),
        max_temp: parseInt(weatherToday.max_temp),
      });

      setForecast(data.consolidated_weather);
    })
    .then(() => setLoading(false))
    .catch((error) => {
      console.log(error);
      setError(error.toString());
      setLoading(false);
    });
  }, []);

  if(loading) return <h1>Loading data...</h1>
  if(error) return <p>An error ocurred: {error}</p>
  if(!weather) return null;

  return (
    <div className={`${css.container}`}>
      <h1 className={`${css.textCenter}`}>Weather</h1>
      <div className={`${css.weatherWrapper}`}>
        <div className={`${css.row}`}>
          { /* location */ }
          <div className={`${css.column}`}>
              <div className={`${css.row}`}>
                <h1 className={`${css.title}`}>{weather.location}</h1>
                  <h1 className={`${css.title} ${css.small} ${css.textRight}`}>{weather.latt_long}</h1>
              </div>
          </div>
          { /* weather details */}
          <div className={`${css.column}`}>
            <div className={`${css.detailsWrapper}`}>
              <img src={`https://www.metaweather.com/static/img/weather/png/64/${weather.weather_state_abbr}.png`}
                alt="weather condition logo" />
              <div>
                  <h1 className={`${css.title}`}>{weather.weather_state}</h1>
                  <h1 className={`${css.title} ${css.small}`}>{weather.min_temp}°C - {weather.max_temp}°C</h1>
              </div>
            </div>
          </div>
        </div>
        { /* togle weekly forecast */}
        <div className={`${css.row}`}>
          <div className={`${css.weekWrapper}`}>
            <small className={`${css.message}`} onClick={toggleForecast} > {showForecast ? 'Hide' :'Show'} week forecast</small>
          </div>
        </div>
        { /* List weekly forecast*/}
        {showForecast &&
          <div className={`${css.row}`}>
            <div className={`${css.column}`}>
              <h4 className={`${css.title} ${css.small} ${css.textCenter}`}>Weekly forecast</h4>
              <ul>
                {forecast.map((day, index) => {
                  return <WeatherDay key={index} day={day} />
                })}
              </ul>
            </div>
          </div>
        }
      </div>
    </div>
  );
}
