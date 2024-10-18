"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import L, { marker } from "leaflet";
import { debounce } from "lodash";

const branchIcon = new L.Icon({
  iconUrl:
    "https://static-00.iconduck.com/assets.00/map-marker-icon-171x256-xkl73sge.png",
  iconSize: [20, 30],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const atmIcon = new L.Icon({
  iconUrl: "/atm.png",
  iconSize: [30, 38],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const ChangeView = ({ coords, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, zoom);
    }
  }, [coords, map]);

  return null;
};

const MapObserver = ({ onBoundsChange }) => {
  const map = useMap();

  useEffect(() => {
    const updateBounds = () => {
      if (!map) {
        return;
      }
      const mapBounds = map.getBounds();
      const northEast = mapBounds.getNorthEast();
      const southWest = mapBounds.getSouthWest();
      const center = map.getCenter();

      const bounds = {
        top: northEast.lat,
        bottom: southWest.lat,
        left: southWest.lng,
        right: northEast.lng,
        center: center,
        zoom: map.getZoom(),
      };

      onBoundsChange(bounds);
    };

    const debouncedUpdateBounds = debounce(updateBounds, 300);

    map.on("moveend", debouncedUpdateBounds);

    updateBounds();

    return () => {
      map.off("moveend", debouncedUpdateBounds);
    };
  }, [map, onBoundsChange]);

  return null;
};

const MapComponent = ({
  selectedLocation,
  selectedCardId,
  newLocations = [],
  oldLocations = [],
  onBoundsChange,
  isLoading,
  error,
  zoom,
  handleSelectedMarker,
}) => {
  const markerRef = useRef({});
  console.log("ZOOM");
  console.log(zoom);
  useEffect(() => {
    if (selectedCardId && markerRef.current[selectedCardId]) {
      markerRef.current[selectedCardId].openPopup();
    }
  }, [selectedCardId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const locationsToRender =
    newLocations.length > 0 ? newLocations : oldLocations;

  return (
    <MapContainer
      center={selectedLocation}
      zoom={zoom}
      // minZoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locationsToRender.map((location) => {
        if (location.category === "ATM") {
          return (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              icon={atmIcon} // Dynamically set the icon based on location type
              ref={(ref) => {
                if (ref) markerRef.current[location.id] = ref;
              }}
              eventHandlers={{
                click: () =>
                  handleSelectedMarker([location.latitude, location.longitude]),
              }}
            >
              <Popup>
                <strong>{location.type}</strong>
                <br />
                <strong>{location.location_name}</strong>
                <br />
                {location.address}
                <br />
                {location.city}, {location.province}
                <br />
                <br />
                <button
                  onClick={() => {
                    window.open(
                      `http://maps.google.com/maps?q=${location.latitude},${location.longitude}`,
                      "_blank"
                    );
                  }}
                  className="btn btn-primary btn-xs"
                >
                  Go to Google Map
                </button>
              </Popup>
            </Marker>
          );
        } else {
          return (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              icon={branchIcon} // Dynamically set the icon based on location type
              ref={(ref) => {
                if (ref) markerRef.current[location.id] = ref;
              }}
              eventHandlers={{
                click: () =>
                  handleSelectedMarker([location.latitude, location.longitude]),
              }}
            >
              <Popup>
                <strong>{location.type}</strong>
                <br />
                <strong>{location.location_name}</strong>
                <br />
                {location.address}
                <br />
                {location.city}, {location.province}
                <br />
                <br />
                <button className="btn btn-primary btn-xs">
                  Go to Google Map
                </button>
              </Popup>
            </Marker>
          );
        }
      })}

      <ChangeView coords={selectedLocation} zoom={zoom} />
      <MapObserver onBoundsChange={onBoundsChange} />
    </MapContainer>
  );
};

export default MapComponent;
