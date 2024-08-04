import { useState, useEffect } from "react";

import "./Clock.css";

// Widget of displaying time
const ClockWidget = (parameters) => {
	// variable
	const [time, setTime] = useState("");
	const [date, setDate] = useState("");


	// get the current time from local clock
	const GetCurrentTime = () => {
		const now = new Date();
		const currentHour = now.getHours().toString().padStart(2, '0');
		const currentMinutes = now.getMinutes().toString().padStart(2, '0');
		const currentSecond = now.getSeconds().toString().padStart(2, '0');
		return `${currentHour}:${currentMinutes}:${currentSecond}`;
	}

	//get the current date from local clock
	const GetCurrentDate = () => {
		const date = new Date();
		const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
		return formattedDate;
	}

	useEffect(() => {
		setDate(GetCurrentDate);


		setTimeout(() => {
			setTime(GetCurrentTime());
		}, 1000);
	});

	return (
		<div className="clockWidget"
			onClick={() => {
				console.log("navigate to TimeDetailsPage");
			}}>
			<span className="date">{date}</span>
			<span className="time">{time}</span>
		</div>
	);
};

export default ClockWidget;
