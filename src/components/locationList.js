import { Pointer } from "lucide-react";
import Card from "./card";

const LocationList = ({ locations, onClick }) => {
  return (
    <>
      {locations?.map((location, index) => (
        <div style={{cursor: 'pointer'}}>
          <Card
            onClick={onClick}
            coordinates={[location.latitude, location.longitude]}
            id={location.id}
            key={index}
            name={location.location_name}
            address={location.address}
            category={location.category}
            className="bg-zinc-200 cursor-pointer"
          />
        </div>
        
      ))}
    </>
  );
};

export default LocationList;
