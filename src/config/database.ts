import { RefreshTokensStore, UsersStore } from "./types"
import { v4 as uuid } from 'uuid'
import jwt from 'jsonwebtoken'
import { query as q } from 'faunadb';
import { fauna } from "../services/fauna"
const auth = process.env.AUTH_SECRET

export const users: UsersStore = new Map()

export const tokens: RefreshTokensStore = new Map()

interface RefreshTokenProps {
  type: string,
  status: boolean,
  data: {
    user_email: string,
    refreshToken: string
  }
}

export async function createRefreshToken(email: string,  payload: object = {}) {
  const refreshToken = jwt.sign(payload, auth, {
    subject: email,
    expiresIn: 60 * 60 * 24, // 1 day
  });

  await fauna.query(
    q.Let(
      {
        refreshToken: q.Match(q.Index('token_by_email'), q.Casefold(email)),
        data: {data: {refreshToken: refreshToken}}
      },
      q.If(
        q.Exists(q.Var('refreshToken')),
        q.Update(q.Select('ref', q.Get(q.Var('refreshToken'))), q.Var('data')),
        q.Create(q.Collection('users_token'), {
          data: {
            user_email: email,
            refreshToken: refreshToken
          }
        })
      )
    )
  );

  
  return refreshToken;
  
}

export async function checkRefreshTokenIsValid(email: string, refreshToken: string) {
  const storedRefreshToken = await fauna.query<RefreshTokenProps>(
    q.Let(
      {
        refreshToken: q.Match(q.Index('token_by_email'), q.Casefold(email)),
      },
      q.If(
        q.Exists(q.Var('user')),
        {
          type: 'Refresh Token Query',
          data: q.Get(q.Var('refreshToken')),
          status: true
        },
        {
          type: 'Error',
          message: 'item not found in index foo',
          status: false,
          code: 42
        }
      )
    )
  )

  
  return storedRefreshToken.status
}

export function invalidateRefreshToken(email: string, refreshToken: string) {
  const storedRefreshTokens = tokens.get(email) ?? []

  tokens.set(email, storedRefreshTokens.filter(token => token !== refreshToken));
}