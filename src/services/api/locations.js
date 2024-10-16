import prisma from "../../../lib/prisma";

export async function getAll(params) {
    // TODO add filter
    return await prisma.location.findMany();
}

export async function getByID(id) {
    if (typeof id !== "number") {
        throw new Error("Invalid ID");
    }

    return await prisma.location.findUnique({
        where: {
            id: id,
        },
    });
}

export async function create(data) {
    if (!data.location_name ||
        !data.address ||
        !data.province ||
        !data.city ||
        !data.latitude ||
        !data.longitude ||
        !data.type ||
        !data.category
    ) {
        throw new Error("Missing required fields");
    }

    return await prisma.location.create({
        data: {
            location_name: data.location_name,
            address: data.address,
            province: data.province,
            city: data.city,
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
            type: data.type,
            category: data.category,
        },
    });
}

export async function update() {
    // TODO
}

export async function destroy(id) {
    if (typeof id !== "number") {
        throw new Error("Invalid ID");
    }

    return await prisma.location.delete({
        where: {
            id: id,
        },
    });
}