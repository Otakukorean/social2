
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../api/trpc";
import bcrypt from 'bcrypt'
import { generateVerficationToken } from "../../../data/tokens";
import { sendVerficationEmail } from "../../../lib/mail";
import { authFormSchema, emailVerificationSchema, exclude, passwordResetSchema } from "~/lib/utils";
import { getUserByEmail } from "~/data/user";
import { signIn } from "~/auth";
import { AuthError } from "next-auth";
import { TRPCError } from "@trpc/server";
import { isRedirectError } from "next/dist/client/components/redirect";

import { initTRPC } from '@trpc/server';
import { getPasswordResetTokenBytoken } from "~/data/password-reset-toke";
import { getVerficationTokenByToken } from "~/data/verification-token";
import { redirect } from "next/navigation";
import { z } from "zod";
export const t = initTRPC.create();
export const userRouter = t.router({
    create: publicProcedure
    .input(authFormSchema('sign-up'))
    .mutation(async ({ ctx, input }) => {
      
      const hashedPassword =await bcrypt.hash(input.password as string  , 10);
      await ctx.db.user.create({
        data: {
            name : input.username ,
            email : input.email ,
            password : hashedPassword
        },
      });
      const verficationToken = await generateVerficationToken(input.email);
      await sendVerficationEmail(verficationToken.email,verficationToken.token)
      return {success : "Confirmation email sent !"}
     

    }),
    updatePassword : publicProcedure
    .input(passwordResetSchema)
    .mutation(async ({ctx , input}) => {
        const {password,token} = input;
        const existingToken =await getPasswordResetTokenBytoken(token);
        if(!existingToken){
          throw new TRPCError({
            code : "NOT_FOUND" ,
            message : "Token not Found!"
          })
      }
      const hasExpired = new Date(existingToken.expires) < new Date();
      if(hasExpired){
        throw new TRPCError({
          code : "NOT_FOUND" ,
          message : "Token has expired!"
        })
    }
    const existingUser = await getUserByEmail(existingToken.email);
      if(!existingToken){
        throw new TRPCError({
          code : "NOT_FOUND" ,
          message : "User not found!"
        })
    }
    const hashedPassword = await bcrypt.hash(password,10);
    await ctx.db.user.update({
      where : {
        id : existingUser?.id
    } ,
    data : {
        password : hashedPassword
    }
    })
    await ctx.db.passwordResetToken.delete({
      where :{
        id : existingToken.id
    }
    })
    return true;

    }) ,
    newVerification : publicProcedure
    .input(emailVerificationSchema)
    .mutation(async ({ctx , input}) => {
      const {token} = input
      const existingtoken= await getVerficationTokenByToken(token);
      if(!existingtoken){
        throw new TRPCError({
          code : "NOT_FOUND" ,
          message : "Token not Found!"
        })
    }
        const hasExpired = new Date(existingtoken.expires) < new Date();
          if(hasExpired){
            throw new TRPCError({
              code : "NOT_FOUND" ,
              message : "Token has expired!"
            })
        }
      const existingUser = await getUserByEmail(existingtoken.email);
        if(!existingtoken){
          throw new TRPCError({
            code : "NOT_FOUND" ,
            message : "User not found!"
          })
      }
      return ctx.db.user.update({
      where : {
        id : existingUser?.id
      } ,
      data : {
        emailVerified : new Date() ,
        email : existingUser?.email
      }
    })
    }),
    getUsers : publicProcedure
    .query(async (opts) =>{
      const {ctx} = opts;
      
      return ctx.db.user.findMany({
        select :{  
          id : true ,
          name : true ,
          image : true ,
        }
      })
    }) ,
    getById : protectedProcedure
    .input(z.object({
      userId : z.string()
    }))
    .query(async (opts) => {
        const {ctx,input} = opts
        const userId = input.userId
        const user = await ctx.db.user.findFirst({
          where : {
            id :userId
          } 
        })
        const userPosts = await ctx.db.post.count({
          where : {
            userId : userId
          }
        })
        const followers = await ctx.db.follows.count({
          where : {
            followingId : userId
          }
        })
        const followeing = await ctx.db.follows.count({
          where : {
            followerId : userId
          }
        })
        return {
          user : exclude(user,['password','role']) ,
          posts : userPosts ,
          followers :followers ,
          following : followeing
        }
      

    })


});
