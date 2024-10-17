import Image from "next/image";
import localFont from "next/font/local";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import useLocations from "../../hooks/useLocations";
import Search from "@/components/search";
import Filter from "@/components/filter";
import LocationList from "@/components/locationList";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const MapComponent = dynamic(() => import("../../components/Map"), {
  ssr: false,
});

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState([-6.2088, 106.8456]);
  const [selectedCardId, setSelectedCard] = useState(null);
  const [oldLocations, setOldLocations] = useState([]);
  const [newLocations, setNewLocations] = useState([]);
  const [bounds, setBounds] = useState({
    top: -8.66127341,
    bottom: -8.676127341,
    left: 115.1568088,
    right: 120.1568088,
  });
  const [zoom, setZoom] = useState(16);

  const { data, mapError, mapIsLoading, refetch } = useLocations(
    bounds.bottom,
    bounds.top,
    bounds.left,
    bounds.right
  );

  const handleBoundsChange = (newBounds) => {
    if (
      newBounds.top === bounds.top &&
      newBounds.bottom === bounds.bottom &&
      newBounds.left === bounds.left &&
      newBounds.right === bounds.right
    ) {
      return;
    }
    setBounds(newBounds);
    setSelectedLocation(newBounds.center);
    setZoom(newBounds.zoom);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setSelectedLocation([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      });
    }
  }, []);

  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      setOldLocations(newLocations);
      setNewLocations(data.data);
    }
  }, [data]);

  const locations = [
    {
      id: 4809,
      location_name: "Denpasar - Arys Mikro Batanta",
      address: "Jl. Pulau Batanta No 31 Denpasar",
      province: "BALI",
      city: "DENPASAR",
      latitude: -8.683223,
      longitude: 115.199912,
      type: "ATM (Tarik Tunai)",
      category: "ATM",
    },
    {
      id: 4810,
      location_name: "Denpasar - Arys Mikro Trengguli",
      address: "Jl. Trengguli Penatih Denpasar",
      province: "BALI",
      city: "DENPASAR",
      latitude: -8.624933,
      longitude: 115.241076,
      type: "ATM (Tarik Tunai)",
      category: "ATM",
    },
    {
      id: 4820,
      location_name: "Denpasar - ATM Center Pemogan",
      address: "Jl. Raya pemogan",
      province: "BALI",
      city: "DENPASAR",
      latitude: -6.699475,
      longitude: 110.197092,
      type: "ATM (Tarik Tunai)",
      category: "ATM",
    },
  ];
  const handleSelectedCard = (coordinates, id) => {
    setSelectedLocation(coordinates);
    setSelectedCard(id);
    setZoom(16);
  };
  const handleSelectedMarker = (coordinates) => {
    setSelectedLocation(coordinates);
    setZoom(16);
  };
  return (
    <div className="h-screen w-screen flex flex-col">
      <nav
        className="navbar text-primary-content px-4 py-2"
        style={{ backgroundColor: "#dc3545" }}
      >
        <div className="flex items-center gap-4">
          <Image
            src="https://www.cimbniaga.co.id/content/dam/cimb/logo/Logo%20CIMB%20white.svg"
            alt="Logo"
            width={200}
            height={100}
          />
        </div>
      </nav>

      <div className="flex flex-col h-screen bg-white">
        <div className="flex flex-row">
          <div className="shrink basis-2/3 p-3">
            <Search />
          </div>
          <div className="shrink basis-1/3 p-3">
            <Filter />
          </div>
        </div>
        <div className="flex flex-row h-screen">
          <div className="basis-2/3 p-3 z-0">
            <MapComponent
              selectedLocation={selectedLocation}
              selectedCardId={selectedCardId}
              newLocations={newLocations}
              oldLocations={oldLocations}
              onBoundsChange={handleBoundsChange}
              isLoading={mapIsLoading}
              error={mapError}
              zoom={zoom}
              handleSelectedMarker={handleSelectedMarker}
            />
          </div>
          <div className="basis-1/3 p-3">
            <LocationList
              onClick={handleSelectedCard}
              locations={newLocations}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
