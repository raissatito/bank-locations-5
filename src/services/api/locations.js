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
