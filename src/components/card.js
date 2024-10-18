import Image from "next/image";
import haversine from "haversine-distance";

const Card = ({
  onClick,
  coordinates,
  id,
  name,
  address,
  category,
  userLocation,
  isAllowed,
}) => {
  const distance = haversine(coordinates, userLocation);
  const formattedDistance = (distance / 1000).toFixed(2);
  return (
    <div className="flex flex-row justify-between bg-zinc-100 rounded-2xl p-3 mb-3">
      <div onClick={() => onClick(coordinates, id)} className="flex flex-col">
        <p className="text-2xl text-black line-clamp-2">{name}</p>
        <p className="text-base text-black line-clamp-1">{address}</p>
        {isAllowed && <p>{formattedDistance} Km</p>}
      </div>
      <div className="flex flex-col justify-center items-center">
        <Image
          src={category === "ATM" ? "/atm.png" : "/bank.png"}
          height={100}
          width={100}
          className="max-w-10"
        />
        <p className="text-xs text-black">
          {category === "ATM" ? "ATM" : "Cabang"}
        </p>
      </div>
    </div>
  );
};

export default Card;
