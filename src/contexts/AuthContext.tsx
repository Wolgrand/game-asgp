import { createContext, ReactNode, useState } from "react";
import Router from 'next/router';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import { api } from "../services/apiClient";
import { useEffect } from "react";

type User = {
  email: string,
  id: string,
  role: string,
  name: string,
  image_url: string,
}

type SignInCredentials = {
  email:string;
  password: string;
}

type AuthContextData = {
  signIn(credentials:SignInCredentials):Promise<void>;
  isAuthenticated: boolean;
  user: User;
}

type AuthProviderprops = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut() {
  destroyCookie(undefined, 'game-asgp.token')
  destroyCookie(undefined, 'game-asgp.refreshToken')

  Router.push('/')
}

export function AuthProvider({ children }: AuthProviderprops) {
  const [user, setUser] = useState<User>()
  const isAuthenticated= !!user;

  useEffect(()=>{
    const { 'game-asgp.token': token} = parseCookies()

    if(token) {
      api.get('/me').then(response => {
        const {email,role, name,image_url, id} = response.data
        
        setUser({
          email,
          id,
          role,
          name,
          image_url,
        })
      }).catch(() => {
        signOut()
      })
    }
  }, [])

  async function signIn({email, password}: SignInCredentials){
    try{
      const response = await api.post('session', {
        email,
        password,
      })

      const { token, refreshToken, role, name, image_url, id } = response.data;

      setCookie(undefined, 'game-asgp.token', token, {
        maxAge: 60 * 60 * 24 * 60, //1 day
        path:'/'
      })
      setCookie(undefined, 'game-asgp.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 60, //1 days
        path:'/'
      })

      setUser({
        email,
        role,
        name,
        image_url,
        id
      })

      api.defaults.headers['Authorization'] = `Bearer ${token}`
  
      Router.push('dashboard');
    }catch (err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider value={{signIn, isAuthenticated, user}}>
      {children}
    </AuthContext.Provider>
  )
}