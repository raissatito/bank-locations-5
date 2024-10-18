// components/MapComponent.js
import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaMapMarker } from "react-icons/fa";
import { renderToStaticMarkup } from "react-dom/server";

// Create a custom icon using react-icons
const customMarkerIcon = new L.DivIcon({
    html: renderToStaticMarkup(
        <FaMapMarker style={{ color: "red", fontSize: "24px" }} />
    ),
    className: "custom-marker-icon",
    iconSize: [24, 24],
    iconAnchor: [12, 24],
});

const MapComponent = ({
    onLocationSelect,
    defaultPosition = [-3.2721456350750127, 114.48303222656251],
    defaultZoom = 5,
}) => {
    const [position, setPosition] = useState(defaultPosition);

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setPosition([lat, lng]);
                onLocationSelect(lat, lng); // Pass coordinates to parent
            },
        });

        return position === null ? null : (
            <Marker position={position} icon={customMarkerIcon}></Marker>
        );
    };

    return (
        <MapContainer
            className="z-0"
            center={position} // Use default position as center
            zoom={defaultZoom}
            style={{ height: "400px", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            <LocationMarker />
        </MapContainer>
    );
};

export default MapComponent;
