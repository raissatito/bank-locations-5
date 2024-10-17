import { generateProvincesCitiesJSON } from "@/services/api/region";
import SearchableDropdown from "./searchableDropdown";
import { useState, forwardRef, useImperativeHandle } from "react";

const Search = ({ regionData, onSearched }) => {
    const provinces = regionData.map((region) => Object.keys(region)[0])
    const [cities, setCities] = useState([])

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("")
    const [selectedCity, setSelectedCity] = useState("")

    const handleProvinceSelect = (province) => {
        if (province !== selectedProvince) {
            setSelectedProvince(province)
            if (province === "") {
                setCities([])
            } else {
                setCities(regionData.filter((region) => Object.keys(region)[0] === province)[0][province])
            }
            setSelectedCity("")
            handleTransferData()
        }
    }

    const handleCitySelect = (city) => {
        setSelectedCity(city)
        handleTransferData()
    }

    const handleTransferData = () => {
        onSearched(searchTerm, selectedProvince, selectedCity)
    }

    return (
        <div className="flex flex-row py-2 px-4 rounded-full bg-zinc-100 divide-x-2 divide-zinc-300">
            <input 
                className="basis-3/5 rounded-l-full bg-zinc-100 text-black outline-none" 
                type="text" 
                placeholder="Search..." 
                onChange={(e) => setSearchTerm(e.target.value)}
                onBlur={() => handleTransferData()}
            />
            <div className={cities.length !== 0 ? "basis-1/5" : "basis-2/5"}>
                <SearchableDropdown kind="Provinsi" data={provinces} onSelected={handleProvinceSelect}/>
            </div>
            { cities.length !== 0 && (
                    <div className="basis-1/5">
                        <SearchableDropdown kind="Kota" data={cities} onSelected={handleCitySelect}/>
                    </div>
                )
            }
        </div>
    );
}

export default Search;