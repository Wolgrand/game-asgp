import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import jwt from 'jsonwebtoken';
import { fauna } from "../../../../services/fauna";
import { DecodedToken } from "../../../../config/types";

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

    const { authorization } = req.headers;

    const [, token] = authorization?.split(' ');

    let decoded = {} as DecodedToken
    try{
      decoded = jwt.verify(token as string, process.env.AUTH_SECRET) as DecodedToken;
    } catch(err) {
      return res 
        .status(401)
        .json({ error: true, code: 'token.expired', message: 'Token has expired.' });
    }
    
    try {
      const solicitations = await fauna.query<Solicitation>(
        q.Map(
          q.Paginate(
            q.Match(
              q.Index('solicitations_by_Email'),
              decoded.sub
            )
          ),
          q.Lambda("X",
          q.Get(
            q.Var("X")
          ))
        )
      );
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