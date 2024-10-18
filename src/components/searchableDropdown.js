"use client";
import React, { useEffect, useState, useRef } from "react";
import { ChevronDownIcon } from "lucide-react";


export default function SearchableDropdown({ kind, data, change, onSelected, selected }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItem, setSelectedItem] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setSearchTerm("");
        setSelectedItem("");
    }, [change]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setSelectedItem(selected)
    }, [selected])

    const filteredItems = data.filter((item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleFocus = () => {
        setIsOpen(true);
    };

    const handleSelection = (item) => {
        setSelectedItem(item);
        setSearchTerm("");
        onSelected(item);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className="relative w-full">
            <div className="flex items-center rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <input
                    type="text"
                    placeholder={kind}
                    className="w-full py-2 px-4 rounded-md bg-zinc-100 text-black outline-none"
                    value={searchTerm !== "" ? searchTerm : selectedItem}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={handleFocus}
                />
                <ChevronDownIcon className="h-5 w-5 text-gray-400 mr-2" />
            </div>

            {isOpen && (
                <div className="absolute w-full mt-1 bg-white rounded-md shadow-lg z-10 max-h-60 overflow-auto">
                    <ul className="py-1">
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                            onClick={() => handleSelection("")}
                        >
                            ----
                        </li>
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item, index) => (
                                <li
                                    key={index}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                                    onClick={() => handleSelection(item)}
                                >
                                    {item}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-500">
                                No {kind} found
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
