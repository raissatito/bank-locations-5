import React from "react";

const DeleteModal = ({ isOpen, onClose, onDeleteConfirm }) => {
  console.log("COMPONENT BREK");
  console.log(isOpen);
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Deletion</h3>
              <p className="py-4">
                Are you sure you want to delete this item? This action cannot be
                undone.
              </p>

              {/* Modal action buttons */}
              <div className="modal-action">
                <button className="btn" onClick={onClose}>
                  Cancel
                </button>
                <button className="btn btn-error" onClick={onDeleteConfirm}>
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteModal;
