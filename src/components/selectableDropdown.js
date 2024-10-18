import { useState } from 'react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/20/solid';


const SelectableDropdown = ({ kind, data, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false); // Manage dropdown visibility
    const [selectedItems, setSelectedItems] = useState([]); // Track selected items

    // Function to toggle the dropdown
    const handleFocus = () => {
      setIsOpen(true);
    };
  
    // Function to close the dropdown after a small delay (to allow item selection)
    const handleBlur = () => {
      onSelect(selectedItems);
      setTimeout(() => setIsOpen(false), 100);
    };
  
    // Function to toggle selection of an item
    const handleSelection = (item) => {
      setSelectedItems((prev) =>
        prev.includes(item)
          ? prev.filter((i) => i !== item) // Unselect if already selected
          : [...prev, item] // Add to selected items if not selected
      );
    };
  
    return (
      <div className="dropdown w-full">
          <div tabIndex={0} role="button" className="flex flex-row justify-between items-center py-2 px-4 m-1 bg-zinc-100 text-black">
            {kind}
            <span>
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-black" />
          </span>
        
        </div>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
          {data.map((item, index) => (
            <li
              key={index}
              className="flex space-x-2 cursor-pointer"
              onClick={() => {handleSelection(item); console.log("kepanggil");}} // This will trigger once when you click the item
            >
              <label className="flex items-center space-x-2 w-full cursor-pointer"
                onClick={(e) => e.stopPropagation()} // Stop event propagation to prevent triggering handleSelection twice
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item)}
                  onChange={() => handleSelection(item)} // Handle the checkbox click
                  onClick={(e) => e.stopPropagation()} // Prevent the event from bubbling up to the `li`
                />
                <span>{item}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  };

export default SelectableDropdown;