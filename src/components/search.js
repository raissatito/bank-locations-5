import { generateProvincesCitiesJSON } from "@/services/api/region";
import SearchableDropdown from "./searchableDropdown";
import { useEffect, useState } from "react";

const Search = ({ regionData, onSearched, filter }) => {
    const provinces = regionData.map((region) => Object.keys(region)[0])
    const [cities, setCities] = useState([])

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("")
    const [selectedCity, setSelectedCity] = useState("")

    const [change, setChange] = useState(true)

    useEffect(() => {
        setSelectedProvince(filter.province)
        setSelectedCity(filter.city)
        setSearchTerm(filter.keyword)
    }, [filter])

    const handleProvinceSelect = (province) => {
        if (province !== selectedProvince) {
            setChange(!change)
            setSelectedProvince(province)
            if (province === "") {
                setCities([])
            } else {
                setCities(regionData.filter((region) => Object.keys(region)[0] === province)[0][province])
            }
            setSelectedCity("")
            handleTransferData(undefined, province, undefined)
        }
    }

    const handleCitySelect = (city) => {
        setSelectedCity(city)
        handleTransferData(undefined, undefined, city)
    }

    const handleTransferData = (search, province, city) => {
        const givenSearch = search === undefined ? searchTerm : search
        const givenProvince = province === undefined ? selectedProvince : province
        const givenCity = city === undefined ? "" : city
        console.log(givenSearch)
        onSearched(givenSearch, givenProvince, givenCity)
    }

    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    const handleInputChange = debounce((e) => {
        handleTransferData(e.target.value, undefined, undefined);
    }, 500);


    return (
        <div className="flex flex-col lg:flex-row py-2 px-4 rounded-3xl lg:rounded-full bg-zinc-100 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-zinc-300">
            <div className="basis-3/5 flex items-center">
                <input 
                    className="basis-3/5 p-2 lg:p-0 rounded-l-full bg-zinc-100 text-black outline-none" 
                    type="text" 
                    placeholder="Search..." 
                    onInput={(e) => {
                        setSearchTerm(e.target.value)
                        handleInputChange(e)
                    }}
                    onBlur={() => handleTransferData(searchTerm, undefined, selectedCity)}
                    value={searchTerm}
                    // onKeyUp={(e) => {e.key === "Enter" && handleTransferData(searchTerm, undefined, undefined)}}
                />
            </div>
            <div className="flex flex-row divide-x-2 divide-zinc-300 basis-2/5">
                <div className={cities.length !== 0 ? "basis-1/2" : "basis-full"}>
                    <SearchableDropdown kind="Provinsi" data={provinces} onSelected={handleProvinceSelect} selected={selectedProvince}/>
                </div>
                { cities.length !== 0 && (
                        <div className="basis-1/2">
                            <SearchableDropdown kind="Kota" data={cities} change={change} onSelected={handleCitySelect} selected={selectedCity}/>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default Search;