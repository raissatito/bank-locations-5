import Card from "./card"

const LocationList = ({locations}) => {

    return (
        <>
            {locations.map((location, index) => (
                <Card key={index} name={location.name} address={location.address} />
            ))}
        </>
    )
}

export default LocationList