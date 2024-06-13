
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
  } from "../../api/trpc";
  
  import bcrypt from 'bcrypt'
  import { generatePasswordResetToken, generateVerficationToken } from "../../../data/tokens";
  import { sendPasswordResetEmail, sendVerficationEmail } from "../../../lib/mail";
  import { authFormSchema } from "~/lib/utils";
  import { z } from "zod";
  import { getUserByEmail } from "~/data/user";
  import { signIn } from "~/auth";
  import { AuthError } from "next-auth";
  import { TRPCError } from "@trpc/server";
  
  
  export const resetRouter = createTRPCRouter({
      create: protectedProcedure
      .input(authFormSchema('reset'))
      .mutation(async ({ ctx, input }) => {
        const {email} = input
        const existingUser = await getUserByEmail(email);
        if(!existingUser){
            throw new TRPCError({
                code : "NOT_FOUND" ,
                message : "Email not found!"
            })
        }
        const passwordResetToken = await generatePasswordResetToken(email)
        await sendPasswordResetEmail(passwordResetToken.email , passwordResetToken.token)
        return true
      })
  
  
  });
  