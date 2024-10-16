import { getManyByCoordinates } from '@/services/api/locations';

export default async function handler(req, res) {

  if (req.method == 'GET') {
    const params = req.query;
    let data;
    try {
       data = await getManyByCoordinates(params);
    } catch (error) {
      console.error(error);
      res.status(500).json({error: true, message: error.message})  
    }

    if (!data) {
      res.status(500).json({error: true})  
    }
    res.status(200).json(data);  
  }
  
  res.status(450).json({error: true})
}