import { getCategories } from "@/services/api/categories";

export default function handler(req, res) {
    const data = getCategories()
        .then((data) => {
            res.status(200).json({ data: data });
        })
        .catch((error) => {
            res.status(500).json({ error: true, message: error.message });
        });

    return;
}
