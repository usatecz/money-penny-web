export interface GoogleUser {
  name: string
  email: string
  picture: string
  googleId: string
}

export interface GoogleJwtPayload {
  sub: string
  name: string
  email: string
  picture: string
}
