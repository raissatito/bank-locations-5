import { getByID, destroy, update } from "@/services/api/locations";
import assert from "node:assert";

export default async function handler(req, res) {
    const { id } = req.query;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
        res.status(400).json({
            error: true,
            message: "Invalid ID: Must be a number!",
        });

        return;
    }

    if (req.method == "PUT") {
        let body = req.body;
        // assert that the value in body is not empty
        try {
            assert(body.location_name, "location name is required");
            assert(body.address, "address is required");
            assert(body.province, "province is required");
            assert(body.city, "city is required");
            assert(body.latitude, "latitude is required");
            assert(body.longitude, "longitude is required");
            assert(body.type, "type is required");
            assert(body.category, "category is required");
        } catch (error) {
            res.status(400).json({ error: true, message: error.message });
            return;
        }

        await update(
            parsedId,
            body.location_name,
            body.address,
            body.province,
            body.city,
            body.latitude,
            body.longitude,
            body.type,
            body.category
        )
            .then((data) => {
                res.status(200).json({ message: "Updated", data: data });
            })
            .catch((error) => {
                res.status(500).json({ error: true, message: error.message });
            });

        return;
    }

    if (req.method == "DELETE") {
        const deleted = await destroy(parsedId)
            .then((data) => {
                res.status(200).json({ message: "Deleted", data: data });
            })
            .catch((error) => {
                res.status(500).json({
                    error: true,
                    message: "Error deleting",
                    debug: error,
                });
            });

        return;
    }

    if (req.method == "GET") {
        const data = await getByID(parsedId)
            .then((data) => {
                res.status(200).json({ data: data });
            })
            .catch((error) => {
                res.status(500).json({ error: true, message: error.message });
            });

        return;
    }

    res.status(450).json({ error: true, message: "Method not Supported" });
}
