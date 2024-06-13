'use server';
import { getUserByEmail } from '~/data/user';
import { z } from 'zod';
import { authFormSchema } from '../utils';
import { signIn } from '~/auth';
import { AuthError } from 'next-auth';
import { generateVerficationToken } from '~/data/tokens';
import { sendVerficationEmail } from '../mail';
const formSchema = authFormSchema('sign-in');
export const LoginUser= async (values : z.infer<typeof formSchema>) => {
    const validateFields = formSchema.safeParse(values)
    if(!validateFields.success) {
        return {error : "Invalid fields!"}
    }

    const {email,password} = validateFields.data;

    const existingUser =await getUserByEmail(email);
    if(!existingUser || !existingUser.email || !existingUser.password) {
        return {error : "Email dose not exist!"}
    }
    if(!existingUser.emailVerified){
        const verficationToken = await generateVerficationToken(existingUser.email);
        await sendVerficationEmail(verficationToken.email,verficationToken.token)
        return {success : "Confirmation email sent!"}
    }
    try {
        await signIn('credentials' , {
            email,
            password ,
            redirectTo :"/"
        })
    } catch (error) {
        if(error instanceof AuthError){
                switch (error.type) {
                    case  'CredentialsSignin' :
                        return {error : "Invalid credential"}
                    default :
                    return {error : "Something went wrong"}
                }
        }
        throw error
    }
}

