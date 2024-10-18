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
import { ChevronUp, ChevronDown } from "lucide-react";

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
    category: "",
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
    filter.category
  );
  const {
    data: filteredData,
    error,
    isLoading,
  } = useFilteredLocations(
    filter.keyword,
    filter.province,
    filter.city,
    filter.category,
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
    setFilter({
      ...filter,
      keyword: searchTerm,
      province: selectedProvince,
      city: selectedCity,
    });
  };

  const getLocations = () => {
    setFilter({
      ...filter,
      category: '',
      keyword: '',
      province: '',
      city: '',
    });
  };

  const handleCategorySelected = (selectedItem) => {
    setFilter({ ...filter, category: selectedItem });
  }

  const handleSelectedCard = (coordinates, id) => {
    setSelectedLocation(coordinates);
    setSelectedCard(id);
    setZoom(16);
    setIsSheetOpen(false);
  };
  const handleSelectedMarker = (coordinates) => {
    setSelectedLocation(coordinates);
    setZoom(16);
  };

  const isFilterEmpty = () => {
    return !filter.keyword && !filter.province && !filter.city;
  };

  const resetFilter = () => {
    console.log("MASHOK");
    setFilter({ keyword: "", province: "", city: "", types: "", page: 1 });
  };

  const locationsToDisplay = isFilterEmpty()
    ? newLocations
    : filteredData?.data;

  const [isSheetOpen, setIsSheetOpen] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)'); // lg breakpoint

    // Function to handle changes in screen size
    const handleScreenChange = (e) => {
      if (e.matches) {
        setIsSheetOpen(true);  // Screen is lg or larger
      } else {
        setIsSheetOpen(false); // Screen is smaller than lg
      }
    };

    // Add event listener to respond to screen size changes
    mediaQuery.addEventListener('change', handleScreenChange);

    // Call the handler on initial load
    handleScreenChange(mediaQuery);

    // Cleanup the event listener on component unmount
    return () => {
      mediaQuery.removeEventListener('change', handleScreenChange);
    };
  }, []);

  return (
    <div className="relative h-screen w-screen">
      {/* Navbar (no longer overlapping) */}
      <nav className="navbar text-primary-content px-4 py-2 w-full z-10" style={{ backgroundColor: '#dc3545' }}>
        <div className="flex items-center gap-4">
          <Image src="https://www.cimbniaga.co.id/content/dam/cimb/logo/Logo%20CIMB%20white.svg" alt="Logo" width={200} height={100} />
        </div>
      </nav>

      {/* Map component taking full screen but pushed below the navbar */}
      <div className="absolute top-16 left-0 w-full h-[calc(100vh-64px)] z-0">
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

      {/* Search and Filter (floating over the map) */}
      <div className="absolute top-16 left-0 w-full flex flex-col lg:flex-row p-4 z-10">
        <div className="lg:basis-2/3 lg:mr-4 mb-2 lg:mb-0">
          <Search regionData={regionData} onSearched={handleSearchQuery} filter={filter} />
        </div>
        <div className=" lg:basis-1/3">
          <Filter onButtonClick={getLocations} onCategorySelected={handleCategorySelected} />
        </div>
      </div>

      {/* Location list (floating over the map on the right) */}
      <div className={`absolute flex flex-col inset-x-0 bottom-0 lg:top-44 lg:right-0 lg:inset-x-auto lg:bottom-auto lg:w-1/3 ${isSheetOpen ? 'h-2/3' : 'h-1/6'} p-3 z-0 lg:mr-2 items-center`}>
        <button className="bg-white text-black w-1/6 rounded-2xl p-2 mb-2 block lg:hidden" onClick={() => setIsSheetOpen(!isSheetOpen)}>
          <div className="flex justify-center items-center">
            {isSheetOpen ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </div>
        </button>
        <div className="bg-white bg-opacity-70 lg:bg-opacity-50 rounded-2xl overflow-y-auto">
          <div className="rounded-2xl p-3 h-full">
              {locationsToDisplay && locationsToDisplay.length > 0 ? (
                  <LocationList
                      locations={locationsToDisplay}
                      onClick={handleSelectedCard}
                  />
              ) : (
                  <div className="text-center text-lg text-gray-500 h-full flex items-center justify-center">
                      No locations found
                  </div>
              )}
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
