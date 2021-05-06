import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../../services/fauna";
import decode from 'jwt-decode';
import { generateJwtAndRefreshToken } from '../../../services/auth';
import jwt from 'jsonwebtoken';

import { checkRefreshTokenIsValid, invalidateRefreshToken } from '../../../config/database';
import { DecodedToken } from '../../../config/types';

type UserData = {
  password?: string;
  permissions: string[];
  roles: string[];
  name: string,
  role: string,
  image_url: string,
  score: number,
}

type UserResponse = {
  data: {
    ref: string,
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
  if(req.method === 'POST'){
    const { authorization } = req.headers;
    const { refreshToken } = req.body;

  if (!authorization) {
    return res
      .status(401)
      .json({ error: true, code: 'token.invalid', message: 'Token not present.' })
  }

  const [, token] = authorization?.split(' ');

  if (!token) {
    return res 
      .status(401)
      .json({ error: true, code: 'token.invalid', message: 'Token not present.' })
  }

  let decoded = {} as DecodedToken
  try{
    decoded = jwt.verify(token as string, process.env.AUTH_SECRET) as DecodedToken;
  } catch(err) {
    return res 
      .status(401)
      .json({ error: true, code: 'token.expired', message: 'Token has expired.' });
  }


  	
  const email = decoded.sub
  
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

  if (!user) {
    return res
      .status(401)
      .json({ 
        error: true, 
        message: 'User not found.'
      });
  }

  if (!refreshToken) {
    return res
      .status(401)
      .json({ error: true, message: 'Refresh token is required.' });
  }

  const isValidRefreshToken = checkRefreshTokenIsValid(email, refreshToken);

  if (!isValidRefreshToken) {
    return res
      .status(401)
      .json({ error: true, message: `'Refresh token is invalid.'` });
  }
 
  //invalidateRefreshToken(email, refreshToken)

  const { token: newToken, refreshToken: newRefreshToken } = await generateJwtAndRefreshToken(email, {
      role: user.data.data.role,
      name: user.data.data.name,
      image_url: user.data.data.image_url,
  })

  return res.status(200).json({
    token: newToken,
    refreshToken: newRefreshToken,
    role: user.data.data.role,
    name: user.data.data.name,
    image_url: user.data.data.image_url,
  });


  }else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
}
};