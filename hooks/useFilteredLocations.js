import useSWR, { mutate } from "swr";
import { fetcher } from "../utils/fetcher"; 

const useFilteredLocations = (keyword, province, city, category, page, lat, long) => {
  const { data, error, isLoading } = useSWR(
    `/api/locations?keyword=${keyword}&province=${province}&city=${city}&category=${category}&page=${page}&lat=${lat}&long=${long}`,
    fetcher
  );

  return {
    data,
    error,
    isLoading,
  };
};

export default useFilteredLocations;
