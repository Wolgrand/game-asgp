import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { DecodedToken } from "../config/types";
import { AuthTokenError } from "../services/errors/AuthTokenError";
import decode from 'jwt-decode';
import jwt from 'jsonwebtoken';

export function withSSRAuth<P>(fn:GetServerSideProps<P>) {
  return async (ctx: GetServerSidePropsContext):Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    const token = cookies['game-asgp.token']

    if(!cookies['game-asgp.token']){

      return {
        redirect: {
          destination: '/',
          permanent:false,
        } 
      }
    }

    
    try {
      const decoded = jwt.verify(token as string, process.env.AUTH_SECRET) as DecodedToken;
    } catch (error) {
        destroyCookie(ctx, 'game-asgp.token')
        destroyCookie(ctx, 'game-asgp.refreshToken')
    
        return {
            redirect: {
              destination: '/',
              permanent:false,
            } 
          }
    }
     
    


    try {
      return await fn(ctx)
    } catch (err) {

      if(err instanceof AuthTokenError) {
        destroyCookie(ctx, 'game-asgp.token')
        destroyCookie(ctx, 'game-asgp.refreshToken')
    
        return {
            redirect: {
              destination: '/',
              permanent:false,
            } 
          }

      }
    }
  
  }
}