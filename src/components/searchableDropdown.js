import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const SearchableDropdown = ({kind, data}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false); // Manage dropdown visibility
    const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4']; // Example items
  
    // Function to filter items based on the search term
    const filteredItems = items.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    // Function to handle input focus (open the dropdown)
    const handleFocus = () => {
      setIsOpen(true);
    };
  
    // Function to handle input blur (close the dropdown after a small delay)
    const handleBlur = () => {
      // Delay hiding to allow selecting options
      setTimeout(() => setIsOpen(false), 100);
    };
  
    return (
      <div onFocus={handleFocus}>
        <div className="flex flex-row justify-between items-center py-2 px-4">
          <input
            type="text"
            placeholder={kind}
            className="w-full bg-zinc-100 text-black outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={handleBlur}
          />
          <span>
            <ChevronDownIcon onClick={handleFocus} className="h-5 w-5 text-black" />
          </span>
        </div>
  
        {isOpen && (
          <div className="absolute w-56 mt-1 bg-base-100 rounded-box shadow-lg z-10">
            <ul className="menu p-2">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <li key={index} className="cursor-pointer">
                    <a>{item}</a>
                  </li>
                ))
              ) : (
                <li>
                  <a>No items found</a>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  };

export default SearchableDropdown;