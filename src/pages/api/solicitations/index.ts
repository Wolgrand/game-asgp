import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../../services/fauna";

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
  if(req.method === 'GET'){
    try {
      const solicitations = await fauna.query<Solicitation>(
        q.Map(
          q.Paginate(
            q.Documents(
              q.Collection('solicitations')
            ),
            {size: 2000}
          ),
          q.Lambda((solicitation) => q.Get(solicitation))
        )
      );
      // ok
      
      // ok
      res.status(200).json(solicitations.data);
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
  }else {
    res.setHeader('Allow', 'GET')
    res.status(405).end('Method not allowed')
  }
};
