import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../api/trpc";
import { PostValidation } from "~/lib/utils";
import { TRPCError } from "@trpc/server";



export const postRouter = createTRPCRouter({
    create: protectedProcedure
    .input(PostValidation)
    .mutation(async ({ ctx, input  }) => {
      if(ctx.session.user.id){
        const validtatedfields = PostValidation.safeParse(input);
        if(!validtatedfields){
          return {error:"Invalid Fields!"}
      }
        const {caption,images,location,tags} = input;
        const splitTag =tags.replace(/ /g, "").split(",").map((value) => ({tag : value}))
        await ctx.db.post.create({
          data :{
            caption,
            locaation : location,
            Image : {
              createMany : {
                data : [
                  ...images.map((image : {url : string}) => image)
              ]
            }
            } ,
            Tag : {
              createMany :{
                data : [
                    ...splitTag.map((tag) => tag)
                ]
               
            }
            } ,
            userId :ctx?.session?.user?.id
          }
        })
      }
      else {
        throw new TRPCError({
          code : 'UNAUTHORIZED',
          message :"You dont have the premission for that!"
        })
      }

    }),
    infinitePosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
        direction: z.enum(['forward', 'backward']), // optional, useful for bi-directional query
        orderBy : z.enum(['asc','desc','']) ,
        search : z.string().optional() ,
        userId : z.string().optional() ,
        tag : z.string().optional()
      }),
    )
    .query(async (opts) => {
      await new Promise((resolve) => setTimeout(resolve , 1500))
      const { input , ctx } = opts;
      const limit = input.limit ?? 10;
      const { cursor , orderBy , search , userId , tag } = input;
      const items = await ctx.db.post.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        cursor: cursor ? { subId:cursor  } : undefined,
        orderBy : {
          createdt : orderBy === 'desc' ? 'desc' : 'asc'
        },
        include :{
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
        },
        where : {
          OR : [
              {
                caption : {
                  contains : search
                }
              },
              {
                Tag : {
                  some : {
                    tag :{
                      contains : search
                    }
                  }
                }
              }
           

          ] ,
          userId : userId ?? undefined ,
          Tag : {
            some  : {
              tag : tag ?? undefined
            }
          }
          
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
    delete : protectedProcedure
    .input(z.object({
      postId : z.string()
    }))
    .mutation(async ({ctx,input}) => {
      const {postId} = input
      const userId = ctx.session.user.id;

      return ctx.db.post.delete({
        where :{
          id : postId,
          userId : userId
          
        }
      })
    })



});
