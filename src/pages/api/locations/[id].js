import { getByID, destroy } from "@/services/api/locations";

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
        // TODO
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