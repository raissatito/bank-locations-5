"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import { debounce } from "lodash";

const defaultIcon = new L.Icon({
  iconUrl: "https://static-00.iconduck.com/assets.00/map-marker-icon-171x256-xkl73sge.png",
  iconSize: [24, 38],
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

    map.on('moveend', debouncedUpdateBounds);

    updateBounds();

    return () => {
      map.off('moveend', debouncedUpdateBounds);
    };
  }, [map, onBoundsChange]);

  return null;
};

const MapComponent = ({ selectedLocation, newLocations = [], oldLocations = [], onBoundsChange, isLoading, error, zoom }) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const locationsToRender = newLocations.length > 0 ? newLocations : oldLocations;

  return (
    <MapContainer
      center={selectedLocation}
      zoom={zoom}
      minZoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locationsToRender.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
          icon={defaultIcon}
        >
          <Popup>
            <strong>{location.type}</strong><br />
            <strong>{location.location_name}</strong><br />
            {location.address}<br />
            {location.city}, {location.province}
          </Popup>
        </Marker>
      ))}

      <ChangeView coords={selectedLocation} zoom={zoom} />
      <MapObserver onBoundsChange={onBoundsChange} />
    </MapContainer>
  );
};

export default MapComponent;
