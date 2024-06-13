import { db } from "../server/db";


export const getVerficationTokenByEmail =  async (email : string) => {
    try {
            const verficationToken = await db.verificationToken.findFirst({
                where : {
                    email
                }
            })
            return verficationToken;
    } catch (error) {
        return null
    }
}
export const getVerficationTokenByToken  =  async (token : string) => {
    try {
            const verficationToken = await db.verificationToken.findUnique({
                where : {
                    token
                }
            })
            return verficationToken;
    } catch (error) {
        return null
    }
}