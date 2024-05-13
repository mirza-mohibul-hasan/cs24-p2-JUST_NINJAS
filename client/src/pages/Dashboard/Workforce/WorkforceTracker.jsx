import axios from "axios";
import { useState, useEffect } from "react";
import { useGeolocated } from "react-geolocated";
const WorkforceTracker = () => {
  const [startTime, setStartTime] = useState(() => {
    const storedStartTime = localStorage.getItem("startTime");
    return storedStartTime ? parseInt(storedStartTime, 10) : null;
  });
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [finishTime, setFinishTime] = useState(null); // New state for finish time
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });
  const handleStartWork = async () => {
    if (!isGeolocationAvailable) {
      return alert("Your Browser Does Not Support Geolocation");
    }
    if (!isGeolocationEnabled) {
      return alert("Geolocation is not enabled");
    }
    await axios.post("http://localhost:3000/workforce/start-working");
    const currentTime = new Date().getTime();
    localStorage.setItem("startTime", currentTime);
    setStartTime(currentTime);
    setTimerRunning(true);
  };
  console.log(coords);
  const handleFinishWork = async () => {
    await axios.post("http://localhost:3000/workforce/finish-working");
    localStorage.removeItem("startTime");
    setStartTime(null);
    setFinishTime(new Date().getTime()); // Set finish time when work is finished
    setTimerRunning(false);
  };

  useEffect(() => {
    let intervalId;

    if (timerRunning) {
      intervalId = setInterval(() => {
        const currentTime = new Date().getTime();
        setElapsedTime(currentTime - startTime);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [timerRunning, startTime]);

  useEffect(() => {
    if (startTime && timerRunning) {
      const currentTime = new Date().getTime();
      setElapsedTime(currentTime - startTime);
    }
  }, [startTime, timerRunning]);

  const formatTime = (time) => {
    if (!time) return "00:00:00";

    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
        <div className="flex flex-col p-2 bg-[#4765ebc3] rounded-box text-white">
          <span className="countdown font-mono text-5xl">
            {formatTime(elapsedTime)}
          </span>
          time
        </div>
      </div>
      <button
        onClick={handleStartWork}
        disabled={timerRunning}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          timerRunning && "opacity-50 cursor-not-allowed"
        }`}
      >
        Start Working
      </button>
      <button
        onClick={handleFinishWork}
        disabled={!timerRunning}
        className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          !timerRunning && "opacity-50 cursor-not-allowed"
        }`}
      >
        Finish Working
      </button>
      <div>
        <p>
          Start Time:{" "}
          {startTime ? new Date(startTime).toLocaleTimeString() : "Not started"}
        </p>
        <p>
          Finish Time:{" "}
          {finishTime
            ? new Date(finishTime).toLocaleTimeString()
            : "Not finished"}
        </p>
      </div>
    </div>
  );
};

export default WorkforceTracker;
