import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../../services/fauna";
import jwt from 'jsonwebtoken';

import { DecodedToken } from '../../../config/types';



type UserResponse = {
  data: {
    ref: {
        id: string
    },
    ts: string,
    data: {
      name: string,
      email: string,
      image_url: string,
      score: number,
      password: string,
      role: string,
      score_extract: [],
      permissions?: string[];
      roles?: string[];
    }
  }
}





export default async (req: NextApiRequest, res: NextApiResponse) => {
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

    const user = await fauna.query<UserResponse>(
      q.Let(
        {
          user: q.Match(q.Index('user_by_email'), q.Casefold(decoded.sub)),
        },
        q.If(
          q.Exists(q.Var('user')),
          {
            type: 'User Query',
            data: q.Get(q.Var('user'))
          },
          {
            type: 'Error',
            message: 'item not found in index foo',
            code: 42
          }
        )
      )
    )

    
    return res.status(200).json({
      score:user.data.data.score, 
      email:user.data.data.email,
      role: user.data.data.role,
      id: user.data.ref.id,
      name: user.data.data.name,
      image_url: user.data.data.image_url,
    });

  }else {
    res.setHeader('Allow', 'GET')
    res.status(405).end('Method not allowed')
}
};