import SearchableDropdown from "./searchableDropdown";
import SelectableDropdown from "./selectableDropdown";

const Filter = () => {
    return (
        <div className="flex flex-row h-full justify-between items-center rounded-full bg-zinc-100">
            <div className="basis-1/3 ml-2 mx-4">
                <SelectableDropdown kind="Filter"/>
            </div>
            <div className="basis-2/3 h-full">
                <button className="bg-black h-full w-full text-white rounded-full px-4 py-1">Search</button>
            </div>
        </div>
    );
};

export default Filter;