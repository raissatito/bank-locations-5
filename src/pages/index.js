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

const MapComponent = dynamic(() => import("../../components/Map"), { ssr: false });

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState([-6.2088, 106.8456]);
  const [oldLocations, setOldLocations] = useState([]);
  const [newLocations, setNewLocations] = useState([]);
  const [bounds, setBounds] = useState({
    top: -8.66127341,
    bottom: -8.676127341,
    left: 115.1568088,
    right: 120.1568088,
  });
  const [zoom, setZoom] = useState(16);

  const { data, mapError, mapIsLoading, refetch } = useLocations(bounds.bottom, bounds.top, bounds.left, bounds.right);

  const handleBoundsChange = (newBounds) => {
    if (newBounds.top === bounds.top && newBounds.bottom === bounds.bottom && newBounds.left === bounds.left && newBounds.right === bounds.right) {
      return;
    }
    setBounds(newBounds);
    setSelectedLocation(newBounds.center);
    setZoom(newBounds.zoom);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setSelectedLocation([position.coords.latitude, position.coords.longitude]);
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
      name: "Jakarta Timur - Alfamart Bambu Hitam (J960)",
      address: "Jl. Bambu Hitam Rt. 004 Rw. 001 Cilangkap",
    },
    {
      name: "Jakarta Barat - Alfamart Bambu Hitam (J960)",
      address: "Jl. Bambu Hitam Rt. 004 Rw. 001 Cilangkap",
    },
    {
      name: "Jakarta Utara - Alfamart Bambu Hitam (J960)",
      address: "Jl. Bambu Hitam Rt. 004 Rw. 001 Cilangkap",
    },
  ];

  return (
    <div className="h-screen w-screen flex flex-col">
      <nav className="navbar text-primary-content px-4 py-2" style={{ backgroundColor: '#dc3545' }}>
        <div className="flex items-center gap-4">
          <Image src="https://www.cimbniaga.co.id/content/dam/cimb/logo/Logo%20CIMB%20white.svg" alt="Logo" width={200} height={100} />
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
              newLocations={newLocations}
              oldLocations={oldLocations}
              onBoundsChange={handleBoundsChange}
              isLoading={mapIsLoading}
              error={mapError}
              zoom={zoom}
            />
          </div>
          <div className="basis-1/3 p-3">
            <LocationList locations={locations} />
          </div>
        </div>
      </div>
    </div>
  );
}
