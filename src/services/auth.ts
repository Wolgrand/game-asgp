import jwt from 'jsonwebtoken'

import { createRefreshToken } from '../config/database';

const auth = process.env.AUTH_SECRET

export async function generateJwtAndRefreshToken(email: string, payload: object = {}) {
  const token = jwt.sign(payload, auth, {
    subject: email,
    expiresIn: 60 * 60 * 24, // 24hours
  });

  const refreshToken = await createRefreshToken(email, payload)
  
  return {
    token,
    refreshToken,
  }
}