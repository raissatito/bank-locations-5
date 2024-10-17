import useSWR, { mutate } from "swr";
import { fetcher } from "../utils/fetcher"; 

const useFilteredLocations = (keyword, province, city, type, page, lat, long) => {
  const { data, error, isLoading } = useSWR(
    `/api/locations?keyword=${keyword}&province=${province}&city=${city}&type=${type}&page=${page}&lat=${lat}&long=${long}`,
    fetcher
  );

  return {
    data,
    error,
    isLoading,
  };
};

export default useFilteredLocations;
