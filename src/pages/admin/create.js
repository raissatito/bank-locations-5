"use client";
import { useState, useEffect } from "react";
import CreateBankBranchFormComponent from "@/components/createForm";
import ModalAlert from "@/components/ModalAlert";

export default function CreateBankBranch() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false); // Hide the alert after 3 seconds
      }, 3000); // 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [isSuccess]);

  return (
    <>
      <div className="flex justify-center bg-gray-100">
        {isSuccess && (
          <ModalAlert text={"Success Creating New Branch!"} type={"success"} />
        )}
      </div>

      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
        <button className="btn btn-outline" onClick={() => setIsOpen(true)}>
          Create New Bank Branch
        </button>
        {isOpen && (
          <CreateBankBranchFormComponent
            onClose={() => setIsOpen(false)}
            handleIsSuccess={() => {
              console.log("Masuk sini rek");
              setIsSuccess(true);
            }}
          />
        )}
      </div>
    </>
  );
}
