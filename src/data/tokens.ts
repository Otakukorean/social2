import {v4 as uuidv4} from "uuid"

import { getVerficationTokenByEmail } from "./verification-token";
import { getPasswordResetTokenByEmail } from "./password-reset-toke";
import { db } from "../server/db";


export const generatePasswordResetToken = async (email: string) => {
        /* eslint-disable */

    const token = uuidv4();
    const expires =new Date(new Date().getTime() + 3000 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);

    if(existingToken) {
        await db.passwordResetToken.delete({
            where: {
               id: existingToken.id 
            }
        })
    }

    const getPasswordResetTokentoken= await db.passwordResetToken.create({
        data :{
            email : email ,
            token ,
            expires
        }
    })
    return getPasswordResetTokentoken
} 


export const  generateVerficationToken = async (email: string)=>{
    const token = uuidv4();
    const expires =new Date(new Date().getTime() + 3000 * 1000);
    const existingtoken = await getVerficationTokenByEmail(email);
    if(existingtoken) {
        await db.verificationToken.delete({
            where : {
                id : existingtoken.id
            }
        })
    }
    const verficationToken= await db.verificationToken.create({
        data : {
            email,token,expires
        }
    })

    return verficationToken;
}