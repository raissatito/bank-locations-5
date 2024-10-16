import prisma from "../../../lib/prisma";
import assert from "node:assert";

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

    if (params.size) {
        query.take = parseInt(params.size);
    } else {
        query.take = 20;
    }

    if (params.page) {
        query.skip =
            (parseInt(params.page) - 1) *
            (params.size ? parseInt(params.size) : 10);
    }

    if (params.sort && params.sort !== "relevance") {
        query.orderBy.push({ [params.sort]: "asc" });
    }

    const data = await prisma.location.findMany(query);

    const pagination = {
        page: params.page ? parseInt(params.page) : 1,
        size: params.size ? parseInt(params.size) : 20,
        total: count,
    };

    return {
        data: data,
        pagination: pagination,
    };
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

export async function update(
    id,
    location_name,
    address,
    province,
    city,
    latitude,
    longitude,
    type,
    category
) {
    // assert type
    assert.equal(typeof location_name, "string");
    assert.equal(typeof address, "string");
    assert.equal(typeof province, "string");
    assert.equal(typeof city, "string");
    assert.equal(typeof latitude, "number");
    assert.equal(typeof longitude, "number");
    assert.equal(typeof type, "string");
    assert.equal(typeof category, "string");
    assert.equal(typeof id, "number");

    // assert valid long lat
    assert.ok(latitude >= -90 && latitude <= 90);
    assert.ok(longitude >= -180 && longitude <= 180);

    return await prisma.location.update({
        where: {
            id: id,
        },
        data: {
            location_name: location_name,
            address: address,
            province: province,
            city: city,
            latitude: latitude,
            longitude: longitude,
            type: type,
            category: category,
        },
    });
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
