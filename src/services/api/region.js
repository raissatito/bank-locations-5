// List provinces and city

import prisma from "../../../lib/prisma";

let regionData = null;
let toRemake = null;

export async function generateProvincesCitiesJSON() {
    if (regionData != null && toRemake == null) {
        return regionData;
    }

    try {
        // Query
        const locations = await prisma.location.findMany({
            select: {
                province: true,
                city: true,
            },
            distinct: ["province", "city"],
        });

        // Process the data
        const provinceMap = new Map();

        locations.forEach(({ province, city }) => {
            if (!provinceMap.has(province)) {
                provinceMap.set(province, new Set());
            }
            provinceMap.get(province).add(city);
        });

        // Convert to array of objects
        const result = Array.from(provinceMap).map(([province, cities]) => ({
            [province]: Array.from(cities),
        }));

        // Cache the result
        regionData = result;
        toRemake = null;

        return result;
    } catch (error) {
        console.error("Error generating provinces-cities JSON:", error);
        throw error;
    }
}

// to call when there is update in the location data (when update, delete, or create)
export async function revalidateProvincesCitiesJSONCache() {
    toRemake = true;
    generateProvincesCitiesJSON();
}
