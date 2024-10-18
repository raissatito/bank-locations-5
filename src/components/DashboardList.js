import { useState, useEffect } from "react";
import { default as DashboardCard } from "./DashboardCard";
import BankBranchForm from "./bank-branch-form";
import useUpdateBranch from "../../hooks/useUpdateBranch";
import DeleteModal from "./DeleteModal";
import useDeleteBranch from "../../hooks/useDeleteBranch";
import ModalAlert from "./ModalAlert";

const DashboardList = ({
  locations,
  regionData,
  category_list,
  branch_type_list,
  reloadLocation,
}) => {
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const { updateData, data, loading, error } = useUpdateBranch();
  const { deleteData, delete_data, isloading, errdelete } = useDeleteBranch();
  // Function to open the update modal

  useEffect(() => {
    if (isAlertOpen) {
      const timer = setTimeout(() => {
        setAlertOpen(false); // Hide the alert after 3 seconds
      }, 3000); // 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [isAlertOpen]);

  const openUpdateModal = (location) => {
    setCurrentLocation(location);
    setUpdateModalOpen(true);
  };

  // Function to close the modal
  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
    setCurrentLocation(null);
  };

  const handleFormSubmit = async (value) => {
    await updateData(value, currentLocation.id);
    setAlertOpen(true);
    closeUpdateModal();
    window.location.reload();
  };

  const openDeleteModal = (location) => {
    setDeleteModalOpen(true);
    setCurrentLocation(location);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setCurrentLocation(null);
  };

  const handleDelete = async () => {
    console.log("DELETE NGAB");
    console.log(currentLocation);
    await deleteData(currentLocation.id);
    setAlertOpen(true);
    closeDeleteModal();
    window.location.reload();
  };

  return (
    <div className="grid gap-4">
      {isAlertOpen && <ModalAlert text={"Operation Success!"} />}
      {locations?.map((location, index) => (
        <>
          {isUpdateModalOpen && currentLocation?.id === location.id && (
            <div className="absolute grid w-full z-10">
              <BankBranchForm
                initialValues={location}
                onSubmit={handleFormSubmit}
                province_cities_list={regionData}
                category_list={category_list}
                branch_type_list={branch_type_list}
                closeModal={closeUpdateModal}
              />
            </div>
          )}
          {isDeleteModalOpen && currentLocation?.id === location.id && (
            <DeleteModal
              isOpen={isDeleteModalOpen}
              onClose={closeDeleteModal}
              onDeleteConfirm={handleDelete}
            />
          )}
          <DashboardCard
            onEdit={() => openUpdateModal(location)}
            onDelete={() => openDeleteModal(location)}
            id={location.id}
            key={index}
            name={location.location_name}
            address={location.address}
          />
        </>
      ))}
    </div>
  );
};

export default DashboardList;
