import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ForecastItem from "./Components/ForecastItem";
import { css } from "@emotion/react";
import CircleLoader from "react-spinners/CircleLoader";

import cloudy from "./Icons/cloudy.png";
import drizzle from "./Icons/drizzle.png";
import rainy from "./Icons/rainy.png";
import snow from "./Icons/snow.png";
import sun from "./Icons/sun.png";
import thunder from "./Icons/thunder.png";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: black;
`;

function App() {
  const API_KEY = "7d778abd4f55b299d095dff0cd3360ca";

  const containerRef = useRef();
  const { current } = containerRef;

  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#000");

  const [input, setInput] = useState("Kiev");
  const [city, setCity] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [main_img, setMainImage] = useState(sun);
  const [description, setDescription] = useState(null);
  const [weekTemperature, setWeekTemperature] = useState({
    data: {
      day_one: "Mon",
      day_two: "Tue",
      day_three: "Wen",
      day_four: "Thu",
      day_five: "Fri",
      day_six: "Sat",
      day_seven: "Sun",
    },
    temperature: {
      day_one: {
        icon: sun,
        min: null,
        max: null,
      },
      day_two: {
        icon: sun,
        min: null,
        max: null,
      },
      day_three: {
        icon: cloudy,
        min: null,
        max: null,
      },
      day_four: {
        icon: sun,
        min: null,
        max: null,
      },
      day_five: {
        icon: rainy,
        min: null,
        max: null,
      },
    },
  });

  let isFalse = false;

  function currentDayCondition(condition) {
    if (condition === "Thunderstorm") {
      return thunder;
    }
    if (condition === "Drizzle") {
      return drizzle;
    }
    if (condition === "Rain") {
      return rainy;
    }
    if (condition === "Snow") {
      return snow;
    }
    if (condition === "Clear") {
      return sun;
    }
    if (condition === "Clouds") {
      return cloudy;
    }
  }

  async function getTemperature() {
    setLoading(false);

    await axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${API_KEY}`
      )
      .then((res) => {
        setCity(input.charAt(0).toUpperCase() + input.slice(1).toLowerCase());
        setLoading(true);
      })
      .catch(function (err) {
        console.error(err.response);
        alert("Сity Not Found");
        isFalse = true;
        setLoading(true);
        return;
      });

    if (!isFalse) {
      await axios
        .get(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&appid=${API_KEY}&units=metric`
        )
        .then((res) => {
          setTemperature(Math.round(res.data["current"]["temp"]));
          setMainImage(
            currentDayCondition(res.data["current"]["weather"][0]["main"])
          );
          setWeekTemperature({
            data: {
              day_one: new Date(res.data["daily"][0]["dt"] * 1000)
                .toString()
                .slice(0, 3),
              day_two: new Date(res.data["daily"][1]["dt"] * 1000)
                .toString()
                .slice(0, 3),
              day_three: new Date(res.data["daily"][2]["dt"] * 1000)
                .toString()
                .slice(0, 3),
              day_four: new Date(res.data["daily"][3]["dt"] * 1000)
                .toString()
                .slice(0, 3),
              day_five: new Date(res.data["daily"][4]["dt"] * 1000)
                .toString()
                .slice(0, 3),
            },
            temperature: {
              day_one: {
                min: Math.round(res.data["daily"][0]["temp"]["min"]),
                max: Math.round(res.data["daily"][0]["temp"]["max"]),
                icon: currentDayCondition(
                  res.data["daily"][0]["weather"][0]["main"]
                ),
              },
              day_two: {
                min: Math.round(res.data["daily"][1]["temp"]["min"]),
                max: Math.round(res.data["daily"][1]["temp"]["max"]),
                icon: currentDayCondition(
                  res.data["daily"][1]["weather"][0]["main"]
                ),
              },
              day_three: {
                min: Math.round(res.data["daily"][2]["temp"]["min"]),
                max: Math.round(res.data["daily"][2]["temp"]["max"]),
                icon: currentDayCondition(
                  res.data["daily"][2]["weather"][0]["main"]
                ),
              },
              day_four: {
                min: Math.round(res.data["daily"][3]["temp"]["min"]),
                max: Math.round(res.data["daily"][3]["temp"]["max"]),
                icon: currentDayCondition(
                  res.data["daily"][3]["weather"][0]["main"]
                ),
              },
              day_five: {
                min: Math.round(res.data["daily"][4]["temp"]["min"]),
                max: Math.round(res.data["daily"][4]["temp"]["max"]),
                icon: currentDayCondition(
                  res.data["daily"][4]["weather"][0]["main"]
                ),
              },
            },
          });
          setDescription(res.data["current"]["weather"][0]["description"]);
        });
    }

    isFalse = false;
    setInput("");
  }

  useEffect(() => {
    getTemperature();
  }, [current]);

  return (
    <div className="App" ref={containerRef}>
      <header>
        <h1>WEATHER APP</h1>
      </header>
      
      {loading ? <div className="container">
        <main>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              value={input}
              placeholder="Enter City"
              onChange={(e) => setInput(e.target.value)}
            />
            <input
              type="submit"
              className="submit-city"
              onClick={getTemperature}
            />
          </form>
          <div className="weather-info">
            <h1 className="city-temperature">
              {city}, {temperature}°C
            </h1>
            <img src={main_img} className="main-img" alt="img"></img>
            <p className="weather-about">{description}</p>
          </div>
          <div className="split-line"></div>
          <div className="week-weather-container">
            <ForecastItem
              date={weekTemperature["data"]["day_one"]}
              icon={weekTemperature["temperature"]["day_one"]["icon"]}
              min={weekTemperature["temperature"]["day_one"]["min"]}
              max={weekTemperature["temperature"]["day_one"]["max"]}
            />
            <ForecastItem
              date={weekTemperature["data"]["day_two"]}
              icon={weekTemperature["temperature"]["day_two"]["icon"]}
              min={weekTemperature["temperature"]["day_two"]["min"]}
              max={weekTemperature["temperature"]["day_two"]["max"]}
            />
            <ForecastItem
              date={weekTemperature["data"]["day_three"]}
              icon={weekTemperature["temperature"]["day_three"]["icon"]}
              min={weekTemperature["temperature"]["day_three"]["min"]}
              max={weekTemperature["temperature"]["day_three"]["max"]}
            />
            <ForecastItem
              date={weekTemperature["data"]["day_four"]}
              icon={weekTemperature["temperature"]["day_four"]["icon"]}
              min={weekTemperature["temperature"]["day_four"]["min"]}
              max={weekTemperature["temperature"]["day_four"]["max"]}
            />
            <ForecastItem
              date={weekTemperature["data"]["day_five"]}
              icon={weekTemperature["temperature"]["day_five"]["icon"]}
              min={weekTemperature["temperature"]["day_five"]["min"]}
              max={weekTemperature["temperature"]["day_five"]["max"]}
            />
          </div>
        </main>
      </div> : <CircleLoader color={color} css={override} size={50} />}
    </div>
  );
}

export default App;
