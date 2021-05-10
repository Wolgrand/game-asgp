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
      const goals = await fauna.query<Solicitation>(
        q.Map(
          // iterate each item in result
          q.Paginate(
            // make paginatable
            q.Match(
              // query index
              q.Index('all_goals') // specify source
            )
          ),
          (ref) => q.Get(ref) // lookup each result by its reference
        )
      );
      // ok
      
      // ok
      res.status(200).json(goals.data);
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
  }else {
    res.setHeader('Allow', 'GET')
    res.status(405).end('Method not allowed')
}
};