import { getAll } from '@/services/api/locations';

export default async function handler(req, res) {

  if (req.method == 'GET') {
    const params = req.query;
    const data = await getAll(params);
    
    if (!data) {
      res.status(500).json({error: true})  
    }
    res.status(200).json({ locations: data });  
  }

  if (req.method == 'POST') {
    // TODO
  }
  
  res.status(450).json({error: true})
}