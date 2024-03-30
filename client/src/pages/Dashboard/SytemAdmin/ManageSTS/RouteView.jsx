import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import RoutingMachine from "./RoutingMachine";
import "leaflet/dist/leaflet.css";
const RouteView = () => {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={[23.236538707071496, 89.10423856700743]}
        zoom={14}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri"
        />
        <Marker position={[23.236538707071496, 89.10423856700743]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <Marker position={[24.226538707071491, 89.10423856700743]}>
          <Popup>
            Another pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <RoutingMachine />
      </MapContainer>
    </div>
  );
};

export default RouteView;
