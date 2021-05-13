import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../../services/fauna";
import { generateJwtAndRefreshToken } from '../../../services/auth';

import { CreateSessionDTO } from '../../../config/types';
import { compareHash } from "../../../utils/BCryptHashProvider";



type UserResponse = {
  data: {
    ref: {id:string},
    ts: string,
    data: {
      name: string,
      email: string,
      image_url: string,
      score: number,
      password: string,
      role: string,
      score_extract: [],
      roles?: string[];
    }
  }
}



export default async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'POST'){
    const { email, password } = req.body as CreateSessionDTO;

    if (
      !email ||
      !password
      ) {
      res.status(400).json({ error: 'Missing body parameter' });
      return;
    }
    

    const user = await fauna.query<UserResponse>(
      q.Let(
        {
          user: q.Match(q.Index('user_by_email'), q.Casefold(email)),
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

    
    const passwordMatched = compareHash(password, user.data.data.password);

    if (!passwordMatched) {
      return res
        .status(401)
        .json({ 
          error: true, 
          message: 'E-mail or password incorrect.'
        });
    }





    const { token, refreshToken } = await generateJwtAndRefreshToken(email, {
      role: user.data.data.role,
      name: user.data.data.name,
      id: user.data.ref.id,
      image_url: user.data.data.image_url,
    })

    

    return res.status(200).json({
      token,
      refreshToken,
      role: user.data.data.role,
      name: user.data.data.name,
      id: user.data.ref.id,
      image_url: user.data.data.image_url,
    });


  }else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
}
};