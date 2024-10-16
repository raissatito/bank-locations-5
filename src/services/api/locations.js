import prisma from "../../../lib/prisma";

export async function getAll(params) {
    // TODO add filter
    return await prisma.location.findMany();
}

export async function getByID() {
    // TODO
    
}


export async function create() {
    // TODO
    
}

export async function update() {
    // TODO
    
}

export async function destroy() {
    // TODO
    
}

