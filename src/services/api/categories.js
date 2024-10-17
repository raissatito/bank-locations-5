import prisma from "../../../lib/prisma";

let categoryData = null;
let toRemakeCategoryData = null;

export async function getCategories() {
    if (categoryData != null && toRemakeCategoryData == null) {
        return categoryData;
    }

    const categories = await prisma.location
        .findMany({
            select: {
                category: true,
            },
            distinct: ["category"],
        })
        .then((data) => {
            return data.map((category) => category.category);
        });

    categoryData = categories;
    toRemakeCategoryData = null;

    return categories;
}

export async function refreshCategories() {
    categoryData = null;
    toRemakeCategoryData = true;
}

let typeData = null;
let toRemakeTypeData = null;

export async function getTypes() {
    if (typeData != null && toRemakeTypeData == null) {
        return typeData;
    }

    const types = await prisma.location
        .findMany({
            select: {
                type: true,
            },
            distinct: ["type"],
        })
        .then((data) => {
            return data.map((type) => type.type);
        });

    typeData = types;
    toRemakeTypeData = null;

    return types;
}

export async function refreshTypes() {
    typeData = null;
    toRemakeTypeData = true;
}
