import SearchableDropdown from "./searchableDropdown";

const Search = () => {
    return (
        <div className="flex flex-row py-2 px-4 rounded-full bg-zinc-100 divide-x-2 divide-zinc-300">
            <input className="basis-3/5 rounded-l-full bg-zinc-100 text-black outline-none" type="text" placeholder="Search..." />
            <div className="basis-1/5">
                <SearchableDropdown kind="Provinsi"/>
            </div>
            <div className="basis-1/5">
                <SearchableDropdown kind="Kota"/>
            </div>
        </div>
    );
}

export default Search;