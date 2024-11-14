import db from '@/libs/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { categoria } = req.query;

  try {
    const events = await db.evento.findMany({
      where: {
        categoria: categoria === 'all' ? undefined : String(categoria),
      },
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching events' });
  }
}
