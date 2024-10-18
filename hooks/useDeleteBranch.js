import { useState } from "react";

const useDeleteBranch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteData = async (branchId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/locations/${branchId}`, {
        method: "DELETE", // Change the method to PUT for updating
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { deleteData, data, loading, error };
};

export default useDeleteBranch;
