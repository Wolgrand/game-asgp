import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import jwt from 'jsonwebtoken';
import { fauna } from "../../services/fauna";
import { DecodedToken } from "../../config/types";

type Player = {
  ref: {
      id: string;
  }
  data: {
    name: string,
    role: string,
    image_url: string,
    score: number,
    score_extract:[]
  }
}

export default async (req: NextApiRequest, res: NextApiResponse<Player[] | any >) => {
  if(req.method === 'GET'){
    const { authorization } = req.headers;
    if (!authorization) {
      return res
        .status(401)
        .json({ error: true, code: 'token.invalid', message: 'Token not present.' })
    }
  
    const [, token] = authorization?.split(' ');
  
    if (!token) {
      return res 
        .status(401)
        .json({ error: true, code: 'token.invalid', message: 'Token invalid.' })
    }

    let decoded = {} as DecodedToken
    try{
      decoded = jwt.verify(token as string, process.env.AUTH_SECRET) as DecodedToken;
    } catch(err) {
      return res 
        .status(401)
        .json({ error: true, code: 'token.expired', message: 'Token has expired.' });
    }



    if (Date.now() >= decoded.exp * 1000) {
      return res 
        .status(401)
        .json({ error: true, code: 'token.expired', message: 'Token has expired.' })
    }
    try {
      const players = await fauna.query<Player>(
        q.Map(
          q.Paginate(
            q.Match(
              q.Index('all_players'),
              'player'
            )
          ),
          q.Lambda("X",
          q.Get(
            q.Var("X")
          ))
        )
      );
      // ok
      res.status(200).json(players.data);
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
  }else {
    res.setHeader('Allow', 'GET')
    res.status(405).end('Method not allowed')
}
};