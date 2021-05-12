import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../../../services/fauna";

type Player = {
  ref: {
      id: string;
  }
  data: {
    name: string,
    password?: string,
    role: string,
    image_url: string,
    score: number,
    score_extract:[]
  }
}

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
   
  
  if(req.method === 'PUT'){
    const {
      query: { id },
    } = req;
  
    const { score, month } = req.body;

    console.log(id)
  
    try {
      const player = await fauna.query<Player>(
        q.Get(q.Ref(q.Collection('users'), id))
      );

      const newScore = Number(player.data.score) + Number(score)

      const olMonthScore = player.data.score_extract[month]
      
      await fauna.query(
        q.Update(q.Ref(q.Collection('users'), id), {
          data: {
            score: newScore,
            score_extract:{
              [month]:Number(score) + Number(olMonthScore)
            }
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