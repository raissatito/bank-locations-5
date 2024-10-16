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
