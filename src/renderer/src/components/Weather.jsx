import { useState, useEffect } from "react";

import { WiDaySunny, WiNightClear, WiRain, WiNightRain, } from "react-icons/wi";

import "./Weather.css";

/*
// Simple fetch method
const weatherJSON = fetch(
	url
)
	.then((response) => response.json())
	.then((data) => {
		console.log(data);
	})
	.catch((error) => {
		console.log("Error: " + error);
	});
*/
/*
fetch(url, { method: "GET" })
	.then((response) => {
		return response.json(); // 使用 json() 可以得到JSON 物件, 使用 text() 可以得到純文字 String
	})
	.then((result) => {
		console.log(result);
	})
	.catch((error) => {
		console.log("Error: " + error);
		
	});
*/

// Widget of displaying weather
const WeatherWidget = (parameters) => {
	// constant
	const url =
		"https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc";

	// variable
	const [temperature, setTemperature] = useState("");
	const [isRainning, setIsRainning] = useState("false");
	const [isDayTime, setIsDayTime] = useState("false");


	// fetch the weather information from HK Observatory
	async function FetchWeartherInformation(url) {
		try {
			// fetch the response data from the url using fetch GET
			const response = await fetch(url, { method: "GET" });
			if (!response.ok) {
				throw new Error(`HTTP error ${response.status}`);
			}
			// translate the response data into JSON object
			const result = await response.json();
			// obtain the temperature for  "Kuen Tong" from the JSON
			const localTemperature = result.temperature.data[22].value;
			setTemperature(localTemperature);

			// obtain the rainfall for "Kuen Tong" from the JSON,
			// if there is rainfall ,then set the "isRainning" as "rain"
			result.rainfall.data[17].max > 0
				? setIsRainning("true")
				: setIsRainning("false");

		} catch (error) {
			console.log("Error:", error.message);
		}
	}

	// get the current time from local
	const GetCurrentTime = () => {
		const currentTime = new Date();
		const currentHour = currentTime.getHours();

		console.log(currentHour);

		(currentHour >= 6) && (currentHour <= 18) ? (setIsDayTime("true")) : (setIsDayTime("false"))

		console.log(isDayTime)
	}

	useEffect(() => {
		FetchWeartherInformation(url);
		GetCurrentTime();
	});

	return (
		<div className="weatherWidget"
			onClick={() => {
				console.log("navigate to TemperatureDetailsPage");
			}}>
			<span>{temperature}°C</span>

			<div className="weatherIcon">
				{/* Check if it is at DayTime, then display daytime icon, else display Night icon */}
				{isDayTime === "true" ?
					(isRainning === "true" ? <WiRain /> : <WiDaySunny />) :
					(isRainning === "true" ? <WiNightRain /> : <WiNightClear />
					)}
			</div>

		</div>
	);
};

export default WeatherWidget;
