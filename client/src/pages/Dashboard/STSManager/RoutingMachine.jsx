import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";

const createRoutineMachineLayer = ({ from, to }) => {
  // console.log(from, to);
  const instance = L.Routing.control({
    // waypoints: [
    //   L.latLng(23.841899409322192, 90.29560103040453),
    //   L.latLng(23.841899409322192, 90.29560103040453),
    // ],
    waypoints: [
      L.latLng(from.latitude, from.longitude),
      L.latLng(to.latitude, to.longitude),
    ],
    lineOptions: {
      styles: [{ color: "#FF0000", weight: 4 }],
    },
    show: true,
    addWaypoints: true,
    waypointIcon: new L.Icon.Default(),
    routeWhileDragging: true,
    draggableWaypoints: true,
    fitSelectedRoutes: true,
    showAlternatives: false,
    createMarker: function () {
      return null;
    },
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
