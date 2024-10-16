import useSWR, { mutate } from "swr";
import { fetcher } from "../utils/fetcher"; 

const useLocations = (minLat, maxLat, minLong, maxLong, category) => {
  const { data, error, isLoading } = useSWR(
    `/api/locations-by-coordinates?minLat=${minLat}&maxLat=${maxLat}&minLong=${minLong}&maxLong=${maxLong}&category=${category}`,
    fetcher
  );

  const refetch = () => {
    mutate(`/api/locations-by-coordinates?minLat=${minLat}&maxLat=${maxLat}&minLong=${minLong}&maxLong=${maxLong}`);
  };

  return {
    data,
    error,
    isLoading,
    refetch,
  };
};

export default useLocations;
