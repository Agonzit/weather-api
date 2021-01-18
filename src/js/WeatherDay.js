import React from "react";
import css from "styles/WeatherDay";

function formatDate(datestring) {
  var {0: year, 1: month, 2: day } = datestring.split("-");
  return day +'/' + month;
}

export default function WeatherDay({day}) {
  return (<li className={`${css.dayDetail}`}>
                          <span> <b>Date:</b> {formatDate(day.applicable_date)}</span>
                          <span> <b>Min:</b> {parseInt(day.min_temp)}°C</span>
                          <span> <b>Max:</b> {parseInt(day.max_temp)}°C</span>
                        </li>);
}