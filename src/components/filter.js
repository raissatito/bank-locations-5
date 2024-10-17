import { useState } from "react";
import SearchableDropdown from "./searchableDropdown";
import SelectableDropdown from "./selectableDropdown";

const Filter = ({onButtonClick}) => {
    const data = ["ATM (Tarik Tunai)", "CDM (Setor Tunai)", "TST (Tarik & Setor Tunai)", "Main Branch (KC)", "Digital Lounge (KCP)", "Sub Branch (KCP)", "Kiosk", "Syariah Main Branch (KCS)", "Kantor Fungsional Syariah (KFS)", "Syariah Main Branch (KCS)", "Weekend Banking"];
    const [filter, setFilter] = useState([]);

    const handleFilter = (selectedItems) => {
        setFilter(selectedItems);
    }

    const handleTransferData = () => {
        onButtonClick(filter)
    }

    return (
        <div className="flex flex-row h-full justify-between items-center rounded-full bg-zinc-100">
            <div className="basis-1/3 ml-2 mx-4">
                <SelectableDropdown kind="Kategori" data={data} onSelect={handleFilter}/>
            </div>
            <div className="basis-2/3 h-full">
                <button onClick={() => handleTransferData()} className="bg-black h-full w-full text-white rounded-full px-4 py-1">Search</button>
            </div>
        </div>
    );
};

export default Filter;