import { getAll, create } from "@/services/api/locations";

export default async function handler(req, res) {
    if (req.method == "GET") {
        const params = req.query;
        let data;
        try {
            data = await getAll(params);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: true, message: error.message });
        }

        if (!data) {
            res.status(500).json({ error: true });
        }
        res.status(200).json(data);
    }

    if (req.method == "POST") {
        try {
            const data = req.body;
            const newLocation = await create(data);

            res
                .status(201)
                .json({ message: "Location created successfully", data: newLocation });
        } catch (error) {
            res.status(400).json({ error: true, message: error.message });
        }
        return;
    }

    res.status(450).json({ error: true });
}