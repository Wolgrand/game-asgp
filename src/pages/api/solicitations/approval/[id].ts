import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../../../services/fauna";

type Solicitation = {
  ref: {
      id: string;
  }
  data: {
    title: string,
    player_id: string,
    score: string,
    month: string,
    status: string
  }
}

export default async (req: NextApiRequest, res: NextApiResponse<Solicitation[] | any >) => {
   if(req.method === 'PUT'){
    const {
      query: { id },
    } = req;
  
    const { status } = req.body;
  
    try {

      await fauna.query(
        q.Update(q.Ref(q.Collection('solicitations'), id), {
          data: {
            status,
          },
        })
      );

      res.status(200).end();
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
  }else {
    res.setHeader('Allow', 'PUT')
    res.status(405).end('Method not allowed')
}
};