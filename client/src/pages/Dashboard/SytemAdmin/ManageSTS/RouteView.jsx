import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import RoutingMachine from "./RoutingMachine";
import "leaflet/dist/leaflet.css";
import { AuthContext } from "../../../../provider/AuthProvider";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { BallTriangle } from "react-loader-spinner";
const RouteView = () => {
  const [mySTS, setMySTS] = useState(null);
  const [allLandfill, setAllLandfill] = useState([]);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !user) {
          return;
        }
        const response = await axios.get(
          `http://localhost:3000/sts/manager-info/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMySTS(response.data);
        // console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        if (!mySTS) return;

        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/sts/route-view/${mySTS.stsId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAllLandfill(response.data.allLandfill);
        setFrom(response.data?.from);
        setTo(response.data?.to);
        // console.log(response);
      } catch (error) {
        console.error("Error fetching assigned vehicles:", error.message);
      }
    };

    fetchRoutes();
  }, [mySTS]);
  if (loading || !from || !to || !allLandfill) {
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
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {from && to && (
        <MapContainer
          style={{ height: "100%", width: "100%" }}
          center={[from.latitude, from.longitude]}
          zoom={14}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri"
          />
          {allLandfill.map((site, index) => (
            <Marker key={index} position={[site.latitude, site.longitude]}>
              <Popup>{site.areaName} Landfill</Popup>
            </Marker>
          ))}
          <Marker position={[from.latitude, from.longitude]}>
            <Popup>STS of WARD NO: {from.ward_num}</Popup>
          </Marker>

          <RoutingMachine from={from} to={to} />
        </MapContainer>
      )}
    </div>
  );
};

export default RouteView;
