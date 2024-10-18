import AdminLayout from "../../../components/AdminLayout";
import Image from "next/image";
import { getSession } from "next-auth/react";
import { generateProvincesCitiesJSON } from "@/services/api/region";
import { useEffect, useState } from "react";
import Search from "@/components/search";
import Filter from "@/components/filter";
import LocationList from "@/components/locationList";
import useFilteredLocations from "../../../hooks/useFilteredLocations";

export default function Dashboard({ regionData }) {
  const [filter, setFilter] = useState({
    keyword: "",
    province: "",
    city: "",
    type: "all",
    page: 1,
  });
  const [userLocation, setUserLocation] = useState([-6.2088, 106.8456]);

  const {
    data: filteredData,
    error,
    isLoading,
  } = useFilteredLocations(
    filter.keyword,
    filter.province,
    filter.city,
    filter.type,
    filter.page,
    userLocation[0],
    userLocation[1]
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const handleSearchQuery = (searchTerm, selectedProvince, selectedCity) => {
    console.log(searchTerm, selectedProvince, selectedCity);
    setSearchTerm(searchTerm);
    setSelectedProvince(selectedProvince);
    setSelectedCity(selectedCity);
  };

  const getLocations = (filter) => {
    console.log(searchTerm, selectedProvince, selectedCity, filter);
  };

  return (
    <AdminLayout>
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
            <div className="basis-1/3 p-3">
              <LocationList
                locations={filteredData?.data}
                // onClick={handleSelectedCard}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const regionData = await generateProvincesCitiesJSON();
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session, regionData },
  };
}
