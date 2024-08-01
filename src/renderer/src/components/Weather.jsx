import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { WiDaySunny, WiHail } from "react-icons/wi";

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
	const [localCondition, setLocalCondition] = useState("sunny");

	// fetch the local temperature
	async function UpdateLocalTemperature(url) {
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
		} catch (error) {
			console.log("Error:", error.message);
		}
	}

	//
	async function UpdateLocalCondition() {
		try {
			// fetch the response data from the url using fetch GET
			const response = await fetch(url, { method: "GET" });
			if (!response.ok) {
				throw new Error(`HTTP error ${response.status}`);
			}
			// translate the response data into JSON object
			const result = await response.json();
			// obtain the temperature for  "Kuen Tong" from the JSON
			result.rainfall.data[17].value > 0
				? setLocalCondition("rain")
				: setLocalCondition("sunny");
		} catch (error) {
			console.log("Error:", error.message);
		}
	}

	useEffect(() => {
		// Obtain and update the local temperature
		UpdateLocalTemperature(url);

		// Obtain and update the local condition
		UpdateLocalCondition(url);
	});

	return (
		<div
			className="weatherWidget"
			onClick={() => {
				console.log("navigate to TemperatureDetailsPage");
			}}>
			<span>{temperature}°C</span>
			{localCondition === "rain" ? (
				<WiHail className="weatherIcon" />
			) : (
				<WiDaySunny className="weatherIcon" />
			)}
		</div>
	);
};

export default WeatherWidget;
