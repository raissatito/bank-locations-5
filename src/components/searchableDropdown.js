import { useEffect, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { on } from 'events';

const SearchableDropdown = ({kind, data, change, onSelected}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setSearchTerm('')
        setSelectedItem('')
    }, [change])
  
    // Function to filter items based on the search term
    let filteredItems = data.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    // Function to handle input focus (open the dropdown)
    const handleFocus = () => {
      setIsOpen(true);
    };
  
    // Function to handle input blur (close the dropdown after a small delay)
    const handleBlur = () => {
      // Delay hiding to allow selecting options
      setTimeout(() => {
        setIsOpen(false)
        filteredItems = data
        setSearchTerm('')
      }, 250);
    };

    const handleSelection = (item) => {
      setSelectedItem(item);
      onSelected(item)
    };

    return (
      <div onFocus={handleFocus}>
        <div className="flex flex-row justify-between items-center py-2 px-4">
          <input
            type="text"
            placeholder={kind}
            className="w-full bg-zinc-100 text-black outline-none"
            value={(searchTerm !== '' || isOpen == true) ? searchTerm : selectedItem}
            onChange={(e) => {setSearchTerm(e.target.value)}}
            onBlur={handleBlur}
          />
          <span>
            <ChevronDownIcon className="h-5 w-5 text-black" />
          </span>
        </div>
  
        {isOpen && (
          <div className="absolute w-1/6 mt-1 bg-base-100 rounded-box shadow-lg z-10">
            <ul className="menu p-2">
              <li>
                  <a onClick={() => handleSelection("")}>----</a>
              </li>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <li key={index} className="cursor-pointer">
                    <a onClick={() => handleSelection(item)}>{item}</a>
                  </li>
                ))
              ) : (
                <li>
                  <a>Tidak ditemukan {kind}</a>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  };

export default SearchableDropdown;