import {Resend} from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (email : string,token : string) => {
    const resetLink = `https://main--sweet-beignet-afcb53.netlify.app/auth/new-password?token=${token}`;
    await resend.emails.send({
        from : "no-replay@email.redanime.net" , 
        to : email,
        subject : "Reset your password" ,
        html : `<p>Click <a href=${resetLink}>here</a> to reset your password.</p>`
    })
}

export const sendVerficationEmail = async (email : string,token : string) => {
        const confirmLink = `https://main--sweet-beignet-afcb53.netlify.app/auth/new-verification?token=${token}`;
        await resend.emails.send({
            from : "no-replay@email.redanime.net" , 
            to : email,
            subject : "Confirm your email" ,
            html : `<p>Click <a href=${confirmLink}>here</a> to confirm email.</p>`
        })
}