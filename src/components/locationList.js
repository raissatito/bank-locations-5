import Card from "./card"

const LocationList = ({locations, onCardClick} ) => {

    const handleCardClick = (location) => {
        console.log(location)
        onCardClick(location)
    }
    return (
        <>
            {locations?.map((location, index) => (
                <div 
                    onClick={() => handleCardClick(location)}
                    className="cursor-pointer"
                >
                    <Card
                        key={index} 
                        name={location.location_name} 
                        address={location.address}
                        
                        />
                </div>
                ))}
        </>
    )
}

export default LocationList