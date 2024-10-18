import prisma from "../../../lib/prisma";
import assert from "node:assert";

export async function getAll(params) {
    let query = {
        where: {},
        orderBy: [],
    };

    const sanitizedKeyword = params.keyword.trim();
    const keyword = sanitizedKeyword.split(" ").map(word => `"${word}"`).join(" & ");
    if (params.keyword) {
        query.where.OR = [
            { location_name: { search: keyword, mode: "insensitive" } },
            { address: { search: keyword, mode: "insensitive" } },
            { province: { search: keyword, mode: "insensitive" } },
            { city: { search: keyword, mode: "insensitive" } },
        ];

        query.orderBy.push({
            _relevance: {
                fields: ["location_name", "address", "province", "city"],
                search: keyword,
                sort: "desc",
            },
        });
    }

    if (params.province) {
        query.where.province =  params.province
    }

    if (params.city) {
        query.where.city =  params.city
    }


    const count = await prisma.location.count(query);

    if (params.size) {
        query.take = parseInt(params.size);
    } else {
        query.take = 20;
    }

    if (params.page) {
        query.skip =
            (parseInt(params.page) - 1) * (params.size ? parseInt(params.size) : 10);
    }

    if (params.sort && params.sort !== "relevance") {
        query.orderBy.push({
            [params.sort]: "asc" });
    }

    if (!!params.types) {
        query.where.type = {
            in: params.types.split(","),
        };
    }
    if (params.category) {
        query.where.category = params.category;
    }

    if (!params.keyword && !params.province && !params.city ) {
        let lat = params.lat;
        let lng = params.long;
        console.log(lat, lng);
        let data =  await prisma.$queryRaw`
                SELECT *,
                        (
                            abs(CAST("latitude" AS double precision) - CAST(${lat} AS double precision)) + 
                            abs(CAST("longitude" AS double precision) - CAST(${lng} AS double precision))
                        ) AS distance  
                FROM "Location"
                ORDER BY distance ASC
                LIMIT 20;
                `;

        return {
            data: data,
        };
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

// export async function create() {
//     // TODO
// }

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

export async function update(
    id,
    location_name,
    address,
    province,
    city,
    latitude,
    longitude,
    type,
    category,
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

export async function getManyByCoordinates(params) {
    const minLat = parseFloat(params.minLat);
    const maxLat = parseFloat(params.maxLat);
    const minLong = parseFloat(params.minLong);
    const maxLong = parseFloat(params.maxLong);
    const sanitizedKeyword = params.keyword?.trim();
    const keyword = sanitizedKeyword?.split(" ").map(word => `"${word}"`).join(" & ");
    const types = params.types;
    const province = params.province;
    const city = params.city;


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

    let query = {
        where: {},
        orderBy: [],
    };
    
    if (params.keyword) {
        query.where.OR = [
            { location_name: { search: keyword, mode: "insensitive" } },
            { address: { search: keyword, mode: "insensitive" } },
            { province: { search: keyword, mode: "insensitive" } },
            { city: { search: keyword, mode: "insensitive" } },
        ];
    }
    if (params.types) {
        query.where.type = {
            in: types?.split(","),
        };
    }

    if (params.category) {
        query.where.category = params.category;
    }

    if (province) {
        query.where.province = province;
    }

    if (city) {
        query.where.city = city;
    }

    query = {
        ...query,
        where: {
            ...query.where,
            latitude: {
                gte: minLat,
                lte: maxLat,
            },
            longitude: {
                gte: minLong,
                lte: maxLong,
            },
        },
    };

    const data = await prisma.location.findMany(query);
    return {
        data,
    };
}