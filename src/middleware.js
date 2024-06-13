
import {NextResponse } from "next/server";
import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {DEFAULT_LOGIN_REDIRECT,apiAuthPrefix,authRoutes,} from './routes'
const {auth} = NextAuth(authConfig);

// @ts-ignore
export default auth((req)  => {
  const {nextUrl} = req;
  const isLoggedIn= !!req.auth;
    
    const isApiAuthRoute =nextUrl.pathname.startsWith(apiAuthPrefix);
    const isAuthRoutes = authRoutes.includes(nextUrl.pathname);
    if(isApiAuthRoute ) {
        return null
    }
    if(isAuthRoutes) {
        if(!isLoggedIn) {
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT,nextUrl))
        }
        return null
    }
    return null
})

export const config = {
   matcher: [ '/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}

