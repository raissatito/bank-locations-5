"use client";
import { useState } from "react";
import CreateBankBranchFormComponent from "@/components/createForm";

export default function CreateBankBranch() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
            <button className="btn btn-outline" onClick={() => setIsOpen(true)}>
                Create New Bank Branch
            </button>
            {isOpen && (
                <CreateBankBranchFormComponent
                    onClose={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
