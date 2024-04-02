import coockeParser from 'cookie-parser'

export const cookieParser = coockeParser(process.env.COOKIE_SECRET)
