import Image from "next/image";
import localFont from "next/font/local";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import useLocations from "../../hooks/useLocations";
import Search from "@/components/search";
import Filter from "@/components/filter";
import LocationList from "@/components/locationList";
import useFilteredLocations from "../../hooks/useFilteredLocations";
import { generateProvincesCitiesJSON } from "@/services/api/region";
import { set } from "lodash";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const MapComponent = dynamic(() => import("../../components/Map"), {
  ssr: false,
});

export default function Home({ regionData }) {
  const [filter, setFilter] = useState({
    keyword: "",
    province: "",
    city: "",
    types: "",
    page: 1,
  });
  const [selectedLocation, setSelectedLocation] = useState([-6.2088, 106.8456]);
  const [userLocation, setUserLocation] = useState([-6.2088, 106.8456]);
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
    bounds.right,
    filter.types
  );
  const {
    data: filteredData,
    error,
    isLoading,
  } = useFilteredLocations(
    filter.keyword,
    filter.province,
    filter.city,
    filter.types,
    filter.page,
    userLocation[0],
    userLocation[1]
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
    if (!!newBounds.center) setSelectedLocation(newBounds.center);
    setZoom(newBounds.zoom);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setSelectedLocation([
          position.coords.latitude,
          position.coords.longitude,
        ]);
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      });
    }
  }, []);

  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      setOldLocations(newLocations);
      setNewLocations(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (filteredData?.data && filteredData.data.length > 0) {
      setSelectedLocation([
        filteredData.data[0].latitude,
        filteredData.data[0].longitude,
      ]);
    }
  }, [filteredData]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const handleSearchQuery = (searchTerm, selectedProvince, selectedCity) => {
    setSearchTerm(searchTerm);
    setSelectedProvince(selectedProvince);
    setSelectedCity(selectedCity);
  };

  const getLocations = (filter) => {
    console.log(filter);
    setFilter({
      keyword: searchTerm,
      province: selectedProvince,
      city: selectedCity,
      page: 1,
      types: filter,
    });
  };

  const handleSelectedCard = (coordinates, id) => {
    setSelectedLocation(coordinates);
    setSelectedCard(id);
    setZoom(16);
  };
  const handleSelectedMarker = (coordinates) => {
    setSelectedLocation(coordinates);
    setZoom(16);
  };

  const isFilterEmpty = () => {
    return !filter.keyword && !filter.province && !filter.city;
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
            <Search regionData={regionData} onSearched={handleSearchQuery} />
          </div>
          <div className="shrink basis-1/3 p-3">
            <Filter onButtonClick={getLocations} />
          </div>
        </div>
        <div className="flex flex-row h-screen">
          <div className="basis-2/3 p-3 z-0">
            <MapComponent
              selectedLocation={selectedLocation}
              selectedCardId={selectedCardId}
              newLocations={isFilterEmpty() ? newLocations : filteredData?.data}
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
              locations={filteredData?.data}
              onClick={handleSelectedCard}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  // Fetch data from external API
  const regionData = await generateProvincesCitiesJSON();

  // Pass data to the page via props
  return { props: { regionData } };
}
