import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const SelectableDropdown = ({ kind, data }) => {
    const [isOpen, setIsOpen] = useState(false); // Manage dropdown visibility
    const [selectedItems, setSelectedItems] = useState([]); // Track selected items
    const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4']; // Example items

    // Function to toggle the dropdown
    const handleFocus = () => {
      setIsOpen(true);
    };
  
    // Function to close the dropdown after a small delay (to allow item selection)
    const handleBlur = () => {
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
      <div onFocus={handleFocus} onBlur={handleBlur} tabIndex={0} className="relative">
        {/* Display selected items as text */}
        <div className="flex flex-row justify-between items-center py-2 px-4">
          <span className="w-full bg-zinc-100 text-black">
            Filter
          </span>
          <span>
            <ChevronDownIcon className="h-5 w-5 text-black" />
          </span>
        </div>
  
        {/* Dropdown menu with checkboxes */}
        {isOpen && (
        <div onFocus={handleFocus} className="absolute w-56 mt-1 bg-white rounded-box shadow-lg z-10">
            <ul className="menu p-2">
            {items.map((item, index) => (
                <li
                key={index}
                className="flex space-x-2 cursor-pointer"
                onClick={() => handleSelection(item)} // Make the entire item clickable
                >
                <label className="flex items-center space-x-2 w-full cursor-pointer">
                    <input
                    type="checkbox"
                    checked={selectedItems.includes(item)}
                    onClick={() => handleSelection(item)} // Still handle the checkbox toggle
                    />
                    <span>{item}</span>
                </label>
                </li>
            ))}
            </ul>
        </div>
        )}

      </div>
    );
  };

export default SelectableDropdown;