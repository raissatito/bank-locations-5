import { useState } from "react";

const useUpdateBranch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateData = async (body, branchId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/locations/${branchId}`, {
        method: "PUT", // Change the method to PUT for updating
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { updateData, data, loading, error };
};

export default useUpdateBranch;
