import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { getUserById } from "./data/user";
import { db } from "./server/db";

export const {
handlers : {GET,POST} ,
auth ,
signIn ,
signOut

} = NextAuth({
    pages :{
        signIn : '/sign-in',
        error : '/error',
    } ,
    events: {
    async linkAccount({user}) {
        await db.user.update({
            where : {
                id: user.id
            } ,
            data : {
                emailVerified : new Date()
            }
        })
    }    
    } ,
    callbacks : {
        async signIn({user,account}) {
            if(account?.provider !== 'credentials') {
                return true
            }
            /* eslint-disable */
            const existingUser = await getUserById(user.id as any);
            if(!existingUser?.emailVerified) {
                return false
            } 
         
            return true;
          
            
        },
        session({session,user,token}) {
    
            
            if(token.sub && session.user) {
                session.user.role = token.role as any;
                session.user.id = token.sub;

            }            
            return session;
        } ,
        async jwt({token}){
            if(!token.sub) return token;
            const existingUser = await getUserById(token.sub);
            if(!existingUser) return token;
            token.role = existingUser.role;
            return token;
        } 
    },
    adapter : PrismaAdapter(db) ,
    session : {
        strategy : 'jwt'
    } ,
    ...authConfig ,

})