import AdminLayout from "../../../components/AdminLayout";
import Image from "next/image";
import { getSession, useSession } from "next-auth/react";
import { generateProvincesCitiesJSON } from "@/services/api/region";
import { useEffect, useState } from "react";
import Search from "@/components/search";
import Filter from "@/components/filter";
import LocationList from "@/components/locationList";
import useDashboardLocations from "../../../hooks/useDashboardLocations";
import DashboardList from "@/components/DashboardList";
import BankBranchForm from "@/components/bank-branch-form";
import { getCategories } from "@/services/api/categories";
import { getTypes } from "@/services/api/categories";
import useCreateBranch from "../../../hooks/useCreateBranch";
import ModalAlert from "@/components/ModalAlert";

export default function Dashboard({
  regionData,
  category_list,
  branch_type_list,
}) {
  const { data: session } = useSession();
  const [dataPage, setPage] = useState(1);
  const [displayedData, setDisplayedData] = useState(null);
  const [filter, setFilter] = useState({
    keyword: "",
    province: "",
    city: "",
    type: "all",
  });
  const {
    data: filteredData,
    error,
    isLoading,
  } = useDashboardLocations(
    filter.keyword,
    filter.province,
    filter.city,
    filter.type,
    dataPage
  );
  useEffect(() => {
    console.log("MASOK");
    console.log(filteredData);
  }, [filteredData]);

  const { postData, post_data, loading, err } = useCreateBranch();

  const [isModalOpen, setModalOpen] = useState(false);
  const [isCreateSuccess, setIsCreateSuccess] = useState(false);

  const nextPage = () => {
    if (filteredData && filteredData.data && filteredData.data.length > 0) {
      setPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (dataPage > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleSearchQuery = (searchTerm, selectedProvince, selectedCity) => {
    setFilter({
      ...filter,
      keyword: searchTerm,
      province: selectedProvince,
      city: selectedCity,
    });
  };

  const handleCategorySelected = (selectedItem) => {
    setFilter({ ...filter, category: selectedItem });
  };

  const getLocations = (filter) => {
    setFilter({
      ...filter,
      category: "",
      keyword: "",
      province: "",
      city: "",
    });
  };
  const handleFormSubmit = async (value) => {
    await postData(value); // Call the postData function from usePost hook
    setModalOpen(false);
    setIsCreateSuccess(true);
    console.log(post_data);
  };

  // Function to open the modal
  const openModal = () => {
    setModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    if (isCreateSuccess) {
      const timer = setTimeout(() => {
        setIsCreateSuccess(false); // Hide the alert after 3 seconds
      }, 3000); // 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [isCreateSuccess]);

  const isFilterEmpty = () => {
    return !filter.keyword && !filter.province && !filter.city;
  };

  return (
    <AdminLayout>
      {isCreateSuccess && <ModalAlert text={"Success!"} type={"success"} />}
      {isModalOpen && (
        <div className="absolute grid w-full z-10">
          <BankBranchForm
            onSubmit={handleFormSubmit}
            province_cities_list={regionData}
            category_list={category_list}
            branch_type_list={branch_type_list}
            closeModal={closeModal}
          />
        </div>
      )}

      <div className="h-screen flex flex-col">
        <div className="flex flex-col h-screen bg-white">
          <div className="flex flex-row">
            <div className="">
              <Search
                regionData={regionData}
                onSearched={handleSearchQuery}
                filter={filter}
              />
            </div>
            <div className="">
              <Filter
                onCategorySelected={handleCategorySelected}
                onButtonClick={getLocations}
              />
            </div>
            <div>
              <button className="btn btn-accent" onClick={openModal}>
                Add New Branch
              </button>
            </div>
          </div>
          <div className="">
            <div className="">
              <DashboardList
                locations={filteredData?.data}
                regionData={regionData}
                category_list={category_list}
                branch_type_list={branch_type_list}
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

  const category_list = await getCategories();
  const branch_type_list = await getTypes();

  return {
    props: { session, regionData, category_list, branch_type_list },
  };
}
