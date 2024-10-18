import useSWR, { mutate } from "swr";
import { fetcher } from "../utils/fetcher";

const useDashboardLocations = (keyword, province, city, types, page) => {
  const { data, error, isLoading } = useSWR(
    `/api/locations?keyword=${keyword}&province=${province}&city=${city}&types=${types}&page=${page}`,
    fetcher
  );

  return {
    data,
    error,
    isLoading,
  };
};

export default useDashboardLocations;
