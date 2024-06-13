"use client";
import React, { useEffect, useState } from 'react'
// import Stores from "~/components/Stores";
import TopCreatorCard from "~/components/CreatorCard";
import Header from "~/components/Header";
import PostCard from "~/components/PostCard";
import PostsFilter from './PostsFilter';
import { Loader2 } from 'lucide-react';
import { api } from '~/trpc/react';
import {useInView} from 'react-intersection-observer'

interface TagPostsProps {
    tag : string;
}

const TagPosts = ({tag} : TagPostsProps) => {
    const [sort,setSort] = useState<'asc' | 'desc' | ''>('')
    const Posts = api.post.infinitePosts.useInfiniteQuery(
        {
          limit: 5,
          orderBy : sort ,
          tag : tag
        },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor 
        },
    
      ); 

    const  {ref , inView} = useInView()
    useEffect(() => {
        const fetchNextPage = async () => {
            if(inView && Posts.hasNextPage){
                await Posts.fetchNextPage()
            }
        }
        fetchNextPage()
      },[inView])
    useEffect(() => {
        const refetch = async () => {
            await Posts.refetch()
        }
        refetch()
      },[sort])
  return (
    <div className="flex flex-1">
    <div className="home-container">
      <div className="home-posts">
        <div className='flex justify-start items-center w-full px-3'>
        <Header content={`#${tag}`} />
        <PostsFilter setSort={setSort} />
        </div>
        {!Posts.isLoading ? (
              <ul className="flex flex-col flex-1 gap-9 w-full ">
              {Posts.data?.pages.map((posts) => (
                    posts.items.map((post) => (
                        <li key={post.id} className="flex justify-center w-full">
                        <PostCard post={{caption:post.caption,createdAt:post.createdt,id:post.id,locaation:post.locaation}} Tags={post.Tag} images={post.Image}  user={post.user} />
                      </li>
                    ))
                  
              ))}
         
          </ul>
        ): <Loader2 color='#877EFF' className='animate-spin' size={25}  />}
        <span className="" ref={ref} style={{visibility : "hidden"}}>fetch</span>
        {Posts.isFetchingNextPage && <Loader2 color='#877EFF' className='animate-spin' size={25}  />}
      </div>
    </div>


  </div>
 
  )
}

export default TagPosts