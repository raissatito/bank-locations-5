import { useState, useEffect } from "react";
import { useForm } from "@/hooks/useForm";
import FormField from "./FormField";
import ModalAlert from "./ModalAlert";

const INITIAL_FORM_STATE = {
  location_name: "",
  address: "",
  province: "",
  city: "",
  latitude: "",
  longitude: "",
  type: "",
  category: "",
};

const FIELD_CONFIG = [
  { name: "location_name", label: "Location Name", type: "text" },
  { name: "address", label: "Address", type: "text" },
  { name: "province", label: "Province", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "latitude", label: "Latitude", type: "text" },
  { name: "longitude", label: "Longitude", type: "text" },
  { name: "type", label: "Type", type: "text" },
  { name: "category", label: "Category", type: "text" },
];

const MIN_STRING_LENGTH = 3;
const MIN_LATITUDE = -90;
const MAX_LATITUDE = 90;
const MIN_LONGITUDE = -180;
const MAX_LONGITUDE = 180;

export default function CreateBankBranchFormComponent({
  onClose,
  handleIsSuccess,
}) {
  const {
    formData,
    errors,
    isLoading,
    isSuccess,
    handleInputChange,
    handleSubmit,
    resetForm,
  } = useForm(INITIAL_FORM_STATE, validateForm, submitForm);

  useEffect(() => {
    resetForm();
  }, []);

  function validateForm(formData) {
    const newErrors = {};

    FIELD_CONFIG.forEach(({ name }) => {
      if (name === "latitude") {
        newErrors[name] = validateLatitude(formData[name]);
      } else if (name === "longitude") {
        newErrors[name] = validateLongitude(formData[name]);
      } else {
        newErrors[name] = validateStringProp(formData[name]);
      }
    });

    return newErrors;
  }

  function validateStringProp(value) {
    if (value.trim().length === 0) {
      return "This field is required";
    }
    if (value.trim().length < MIN_STRING_LENGTH) {
      return `This field must be at least ${MIN_STRING_LENGTH} characters`;
    }
    return "";
  }

  function validateLatitude(latitude) {
    if (latitude.trim().length === 0) {
      return "This field is required";
    }
    if (isNaN(latitude)) {
      return "Latitude must be a number";
    }
    const latitudeNum = parseFloat(latitude);
    if (latitudeNum < MIN_LATITUDE || latitudeNum > MAX_LATITUDE) {
      return `Latitude must be between ${MIN_LATITUDE} and ${MAX_LATITUDE}`;
    }
    return "";
  }

  function validateLongitude(longitude) {
    if (longitude.trim().length === 0) {
      return "This field is required";
    }
    if (isNaN(longitude)) {
      return "Longitude must be a number";
    }
    const longitudeNum = parseFloat(longitude);
    if (longitudeNum < MIN_LONGITUDE || longitudeNum > MAX_LONGITUDE) {
      return `Longitude must be between ${MIN_LONGITUDE} and ${MAX_LONGITUDE}`;
    }
    return "";
  }

  async function submitForm(formData) {
    const dataToSend = {
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
    };

    try {
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      onClose();
      handleIsSuccess();
      return true;
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error.message);
      return false;
    }
  }

  return (
    <dialog id="create-form" className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-black text-2xl">Create New Bank Branch</h3>
        <p className="py-4 text-black">
          Enter the details for the new bank branch.
        </p>
        <form onSubmit={handleSubmit} aria-label="Create Bank Branch Form">
          {FIELD_CONFIG.map((field) => (
            <FormField
              key={field.name}
              {...field}
              value={formData[field.name]}
              error={errors[field.name]}
              onChange={handleInputChange}
            />
          ))}
          <div className="modal-action">
            {isLoading ? (
              <button className="btn btn-primary" disabled aria-busy="true">
                <span className="loading loading-spinner"></span>
                Please wait
              </button>
            ) : isSuccess ? (
              () => {
                handleIsSuccess();
              }
            ) : (
              <button type="submit" className="btn btn-primary">
                Create Branch
              </button>
            )}
            <button className="btn" onClick={onClose} type="button">
              Close
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
