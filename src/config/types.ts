export type CreateSessionDTO = {
  email: string;
  password: string;
}

type UserData = {
  password?: string;
  permissions: string[];
  roles: string[];
  name: string,
  role: string,
  image_url: string,
  score: number,
}

export type UsersStore = Map<string, UserData>

export type RefreshTokensStore = Map<string, string[]>

export type DecodedToken = {
  sub: string;
  exp: number
}