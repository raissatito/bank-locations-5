import { FaEdit, FaTrashAlt } from "react-icons/fa";

const DashboardCard = ({ id, name, address, onEdit, onDelete }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p>{address}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary btn-sm" onClick={onEdit}>
            <FaEdit className="mr-2" />
            Update
          </button>
          <button className="btn btn-error btn-sm" onClick={onDelete}>
            <FaTrashAlt className="mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
