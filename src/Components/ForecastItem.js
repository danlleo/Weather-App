import React from "react";

function ForecastItem(props) {
  return (
    <div className="week-weather-container_item">
      <p>{props.date}</p>
      <img src={props.icon} className="item-img" alt="img"></img>
      <p>
        {props.min}/{props.max}
      </p>
    </div>
  );
}

export default ForecastItem;
