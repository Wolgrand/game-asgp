import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../../../services/fauna";

type Solicitation = {
  ref: {
      id: string;
  }
  data: {
    title: string,
    player: {
      id: string,
      name: string,
      image_url: string
    },
    score: string,
    month: string,
    status: string
  }
}

export default async (req: NextApiRequest, res: NextApiResponse<Solicitation[] | any >) => {
  if(req.method === 'POST'){
    const { player, title, score, month } = req.body;
    try {
      await fauna.query(
        q.Create(q.Collection('solicitations'), {
          data: {
            player,
            title,
            score,
            month,
            status: 'Aguardando aprovação'
          },
        })
      );
      // ok
      res.status(200).end();
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
  }else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
}
};