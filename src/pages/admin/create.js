import BankBranchForm from "@/components/bank-branch-form";
import { getCategories, getTypes } from "@/services/api/categories";
import { generateProvincesCitiesJSON } from "@/services/api/region";

export async function getServerSideProps() {
    const province_cities_list = await generateProvincesCitiesJSON();
    const category_list = await getCategories();
    const branch_type_list = await getTypes();

    return {
        props: {
            province_cities_list,
            category_list,
            branch_type_list,
        },
    };
}

export default function Create({
    province_cities_list,
    category_list,
    branch_type_list,
}) {
    let oldBranch = {
        type: "ATM",
        category: "ATM",
        location_name: "Bank Branch 1",
        address: "Jl. Jendral Sudirman No. 1",
        province: "BALI",
        city: "BADUNG",
        latitude: -6.2087634,
        longitude: 106.845599,
    };

    function handleFormSubmit(values) {
        console.log(values);
    }

    return (
        <div
            className={`grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
        >
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <p>Create New Branch</p>
                <BankBranchForm
                    onSubmit={handleFormSubmit}
                    province_cities_list={province_cities_list}
                    category_list={category_list}
                    branch_type_list={branch_type_list}
                />

                <p>Update Branch</p>
                <BankBranchForm
                    initialValues={oldBranch}
                    onSubmit={handleFormSubmit}
                    province_cities_list={province_cities_list}
                    category_list={category_list}
                    branch_type_list={branch_type_list}
                />
            </main>
        </div>
    );
}
