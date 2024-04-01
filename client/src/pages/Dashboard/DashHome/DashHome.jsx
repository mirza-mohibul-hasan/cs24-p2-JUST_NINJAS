import axios from "axios";
import { useEffect, useState } from "react";
import { BallTriangle } from "react-loader-spinner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import useTitle from "../../../hooks/useTitle";

const formatTime = (timeString) => {
  const date = new Date(timeString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const DashHome = () => {
  useTitle("Dashboard");
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/dashboard/statistics`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStatistics(response.data);
        // console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching statistics:", error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !statistics) {
    return (
      <div className="flex justify-center items-center h-full">
        <BallTriangle
          height={100}
          width={100}
          radius={5}
          color="#2145e6"
          ariaLabel="ball-triangle-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }

  const pieData = [
    { name: "Total Weight of Waste", value: statistics.totalWeightOfWaste },
    { name: "Total Weight at STS", value: statistics.totalWeightAtSTS },
    {
      name: "Total Weight at Landfill",
      value: statistics.totalWeightAtLandfill,
    },
    { name: "Total Fuel Cost", value: statistics.totalFuelCost },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="w-full flex justify-center flex-col items-center">
      <h2 className="text-3xl font-semibold -mb-5">Daily Statistics</h2>
      <PieChart width={400} height={400} className="w-full">
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      <h2 className="text-3xl font-semibold mb-5">
        Waste Collection Statistics
      </h2>
      <BarChart width={600} height={300} data={statistics.billing}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="billTime" tickFormatter={formatTime} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="weightOfWaste" fill="#8884d8" />
      </BarChart>

      <h2 className="text-3xl font-semibold mb-5">
        STS Waste Transport Statistics{" "}
      </h2>
      <BarChart width={600} height={300} data={statistics.stsWasteTransport}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timeOfArrival" tickFormatter={formatTime} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="weightOfWaste" fill="#82ca9d" />
      </BarChart>

      <h2 className="text-3xl font-semibold mb-5">
        Landfill Waste Transport Statistics
      </h2>
      <BarChart
        width={600}
        height={300}
        data={statistics.landfillWasteTransport}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timeOfArrival" tickFormatter={formatTime} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="weightOfWaste" fill="#ff7300" />
      </BarChart>
    </div>
  );
};

export default DashHome;
