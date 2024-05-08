import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import RoutingMachine from "./RoutingMachine";
import "leaflet/dist/leaflet.css";
import { AuthContext } from "../../../provider/AuthProvider";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { BallTriangle } from "react-loader-spinner";
import moment from "moment";
import L from "leaflet";
import useTitle from "../../../hooks/useTitle";
const RouteView = () => {
  useTitle("Route View");
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
          `http://localhost:3000/sts-manager/route-view/${mySTS.stsId}`,
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
  if (!mySTS) {
    return (
      <div className="flex justify-center flex-col items-center h-full">
        <p className="text-5xl text-center">You Do not Have STS</p>
        <BallTriangle
          height={100}
          width={100}
          radius={5}
          color="#ff0000"
          ariaLabel="ball-triangle-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }
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
  var stsIcon = L.icon({
    iconUrl: "https://i.ibb.co/2s8zYPx/trash-9233605.png",
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76],
  });
  var landfillIcon = L.icon({
    iconUrl: "https://i.ibb.co/51nLm7L/level-705884.png",
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76],
  });
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
            <Marker
              key={index}
              position={[site.latitude, site.longitude]}
              icon={landfillIcon}
            >
              <Popup>
                <div>
                  <h3 className="text-2xl">{site.areaName} Landfill</h3>
                  <p>Capacity: {site?.capacity}</p>
                  <p>
                    Lattitude: {site?.latitude} & Longitude: {site?.longitude}
                  </p>
                  <p>Open: {moment(site?.starttime).format("LT")}</p>
                  <p>Close: {site?.endtime}</p>
                </div>
              </Popup>
            </Marker>
          ))}
          <Marker position={[from.latitude, from.longitude]} icon={stsIcon}>
            <Popup>
              <div>
                <p className="text-2xl">STS of Ward Number: {from.ward_num}</p>
                <p>CAPACITY: {from.capacity}</p>
                <p>Lattitude:{from.latitude}</p>
                <p>Longitude: {from.longitude}</p>
              </div>
            </Popup>
          </Marker>

          <RoutingMachine from={from} to={to} />
        </MapContainer>
      )}
    </div>
  );
};

export default RouteView;
