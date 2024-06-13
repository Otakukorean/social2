import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type {NextAuthConfig} from 'next-auth'
import { authFormSchema } from "./lib/utils";
import { getUserByEmail } from "./data/user";
import bcryptjs from 'bcryptjs'
import { redirect } from "next/navigation";
export default {
    providers : [
        Credentials({
            async authorize(credentials) {
                const validatedFields = authFormSchema('sign-in').safeParse(credentials);
                if(validatedFields.success){
                    const {email,password} = validatedFields.data;
                    const user=await getUserByEmail(email);
                    if(!user?.password) return null;
                    /* eslint-disable */
                    const passwordMatch =await bcryptjs.compare(password as any, user.password);
                    if(passwordMatch){
                       
                        return user
                    };
                }
                return null
            }
        }) ,
        Google({
            clientId :process.env.GOOGLE_CLIENT_ID ,
            clientSecret :process.env.GOOGLE_CLIENT_SECRET 
        })
    ]
} satisfies NextAuthConfig