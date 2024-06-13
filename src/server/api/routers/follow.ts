
import { TRPCError } from "@trpc/server";
import {
    createTRPCRouter,
    protectedProcedure,
  } from "../../api/trpc";
import { z } from "zod";
 
export const followRouter = createTRPCRouter({
    create : protectedProcedure
    .input(z.object({
        followingId : z.string()
    }))
    .mutation((async ({ctx,input}) => {
        const {followingId} = input
        const userId = ctx.session.user.id;
        if(userId) {
            if(followingId === userId) {
                throw new TRPCError({
                    code :"BAD_REQUEST" ,
                    message : "You Cant Follow yourself!"
                })
            }
            const ifExist = await ctx.db.follows.findFirst({
                where : {
                    followingId : followingId,
                    followerId : userId
                }
            })
            if(!ifExist) {
                return ctx.db.follows.create({
                    data: {
                        followingId : followingId ,
                        followerId : userId
                   }
                })
            }
            else {
                return ctx.db.follows.deleteMany({
                    where : {
                        followingId : followingId ,
                        followerId : userId
                   }
                })
            }
         
        }
    })) ,
    ifFollow : protectedProcedure
    .input(z.object({
        followingId : z.string()
    }))
    .query(async (opts) => {
        const {ctx,input} = opts
        const {followingId} = input
        const userId = ctx.session.user.id;
        if(userId && followingId){
            return ctx.db.follows.findFirst({
                where : {
                    followingId : followingId ,
                    followerId : userId
                }
            })
        }
        throw new TRPCError({
            code :"BAD_REQUEST" ,
            message : "Something Went Wrong!"
        })
    })
  });
  