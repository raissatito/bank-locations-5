import { useState } from "react";
import SearchableDropdown from "./searchableDropdown";
import SelectableDropdown from "./selectableDropdown";
import { set } from "lodash";

const Filter = ({onCategorySelected, onButtonClick}) => {
    const data = ["ATM", "Branch"];
    const [filter, setFilter] = useState('');

    const handleFilter = (selectedItems) => {
        setFilter(selectedItems);
        onCategorySelected(selectedItems);
    }

    const handleResetFilter = () => {
        setFilter('');
        onButtonClick();
    }

    return (
        <div className="flex flex-row h-full justify-between items-center rounded-full bg-zinc-100">
            <div className="basis-1/3 ml-2 mx-4">
                <SearchableDropdown kind="Kategori" data={data} onSelected={handleFilter} selected={filter} />
            </div>
            <div className="basis-2/3 h-full">
                <button onClick={() => handleResetFilter()} className="bg-black h-full w-full text-white rounded-full px-4 py-1">Reset Filter</button>
            </div>
        </div>
    );
};

export default Filter;