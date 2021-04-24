import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../../services/fauna";

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
   if(req.method === 'GET'){
    const {
      query: { id },
    } = req;
  
  
    try {
      
      const player = await fauna.query<Player>(
        q.Get(q.Ref(q.Collection('users'), id))
      );

      delete player.data.password
      res.status(200).json(player.data);
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
  }else {
    res.setHeader('Allow', 'GET')
    res.status(405).end('Method not allowed')
}
};