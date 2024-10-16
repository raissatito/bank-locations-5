import { generateProvincesCitiesJSON } from "@/services/api/region";

export default async function handler(req, res) {
    if (req.method == "GET") {
        return generateProvincesCitiesJSON()
            .then((json) => {
                res.status(200).json({ data: json });
            })
            .catch((error) => console.error("Error:", error));
    }

    return res
        .status(450)
        .json({ error: true, message: "Method not Supported" });
}
