
import {
    createTRPCRouter,
    protectedProcedure,
  } from "../../api/trpc";
import { z } from "zod";
 
export const savedRouter = createTRPCRouter({
      create: protectedProcedure
      .input(z.object({
        postId : z.string()
      }))
      .mutation(async ({ ctx, input }) => {
            const {postId} = input;
            const {session} = ctx
            const userId = session.user.id
            if(userId){
                const isPostExist = await ctx.db.saved.findFirst({
                    where : {
                        userId : userId,
                        postId : postId
                    }
                })
                if(isPostExist){
                return ctx.db.saved.delete({
                        where : {
                            id : isPostExist.id,
                            userId : userId,
                            postId : postId
                        }
                    })
            
                }
                return ctx.db.saved.create({
                    data : {
                        userId : userId ,
                        postId : postId
                    }
                })

            }
      }) ,
      getAll :protectedProcedure   
        .input(
        z.object({
          limit: z.number().min(1).max(100).nullish(),
          cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
          direction: z.enum(['forward', 'backward']), // optional, useful for bi-directional query
          orderBy : z.enum(['asc','desc','']) ,
        }),
      )
      .query(async (opts) => {
        await new Promise((resolve) => setTimeout(resolve , 1500))
        const { input , ctx } = opts;
        const limit = input.limit ?? 10;
        const { cursor , orderBy  } = input;
        const userId = ctx.session.user.id
        const items = await ctx.db.saved.findMany({
          take: limit + 1, // get an extra item at the end which we'll use as next cursor
          cursor: cursor ? { subId:cursor  } : undefined,
          orderBy : {
            createdt : orderBy === 'desc' ? 'desc' : 'asc'
          },
          include :{
            post : {
                include : {
                    Image : {
                        select :{
                          url : true
                        }
                      } ,
                      Tag :{
                        select :{
                          tag : true
                        }
                      } ,
                      user : {
                        select :{
                          name :true,
                          id :true,
                          image: true
                        }
                      }
                }
            }
            
          },
          where :{
            userId : userId
          }
        });
        let nextCursor: typeof cursor | undefined = undefined;
        if (items.length > limit) {
          const nextItem = items.pop();
          nextCursor = nextItem!.subId;
        }
        return {
          items,
          nextCursor,
        };
      }),
      isExist : protectedProcedure
      .input(z.object({
        postId : z.string()
      }))
      .query(async (opts) => {
        const {input,ctx} = opts
        const {postId} = input;
        const userId = ctx.session.user.id;

        return ctx.db.saved.findFirst({
            where : {
                postId : postId ,
                userId : userId
            }
        })
      })
  
  
  });
  