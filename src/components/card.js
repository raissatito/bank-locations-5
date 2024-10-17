
const Card = ({ name, address }) => {

    return (
        <>
            <div className="flex flex-col bg-zinc-100 rounded-2xl p-3 mb-3">
                <p className="text-2xl text-black">
                    {name}
                </p>
                <p className="text-base text-black">
                    {address}
                </p>
            </div>
        </>
    )
}
    

export default Card