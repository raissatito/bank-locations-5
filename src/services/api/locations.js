import prisma from "../../../lib/prisma";

export async function getAll(params) {
    let query = {
        where: {},
        orderBy: [],
    };

    if (params.keyword) {
        query.where.OR = [
            { location_name: { search: params.keyword, mode: "insensitive" } },
            { address: { search: params.keyword, mode: "insensitive" } },
            { province: { search: params.keyword, mode: "insensitive" } },
            { city: { search: params.keyword, mode: "insensitive" } },
        ];

        query.orderBy.push({
            _relevance: {
                fields: ["location_name", "address", "province", "city"],
                search: params.keyword,
                sort: "desc",
            },
        });
    }

    if (params.province) {
        query.where.province = { search: params.province, mode: "insensitive" };
    }

    const count = await prisma.location.count(query);

    if (params.size ) {
        query.take = parseInt(params.size);
    } else {
        query.take = 20
    }

    if (params.page) {
        query.skip = (parseInt(params.page) - 1) * (params.size ? parseInt(params.size) : 10);
    }

    if (params.sort && params.sort !== "relevance") {
        query.orderBy.push({ [params.sort]: "asc" });
    }

    const data = await prisma.location.findMany(query);

    const pagination = {
        page: params.page ? parseInt(params.page) : 1,
        size: params.size ? parseInt(params.size) : 20,
        total: count,
    }

    return {
        data: data,
        pagination: pagination
        
    }
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

export async function create() {
    // TODO
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

export async function getManyByCoordinates(params) {
    const minLat = parseFloat(params.minLat);
    const maxLat = parseFloat(params.maxLat);
    const minLong = parseFloat(params.minLong);
    const maxLong = parseFloat(params.maxLong);

    console.log(minLat, maxLat, minLong, maxLong);

    if (!minLat || !maxLat || !minLong || !maxLong) {
        throw new Error("Invalid Coordinates");
    }

    if (minLat > maxLat) {
        throw new Error("min latitude cannot be greater than max latitude");
    }

    if (minLong > maxLong) {
        throw new Error("min longitude cannot be greater than max longitude");
    }

    if (maxLat > 90 || maxLat < -90 || minLat > 90 || minLat < -90) {
        throw new Error("Latitude must be between -90 and 90");
    }

    if (maxLong > 180 || maxLong < -180 || minLong > 180 || minLong < -180) {
        throw new Error("Longitude must be between -180 and 180");
    }

    const data = await prisma.location.findMany({
        where: {
            latitude: {
                gte: minLat,
                lte: maxLat,
            },
            longitude: {
                gte: minLong,
                lte: maxLong,
            },
        },
    });
    return {
        data
    };
}
