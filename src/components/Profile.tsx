"use client";
import Image from 'next/image';
import React, { Fragment, useState } from 'react'
import { api } from '~/trpc/react';
import FollowBtn from './FollowBtn';
import Header from './Header';
import PostsFilter from './PostsFilter';
import { Loader2 } from 'lucide-react';
import PostCard from './PostCard';
import { useInView } from 'react-intersection-observer';

interface ProfileProps {
    userId : string;
}

const Profile = ({userId} : ProfileProps) => {
  const [sort,setSort] = useState<'asc' | 'desc' | ''>('')
  const {data} = api.user.getById.useQuery({
    userId : userId
  })
  const Posts = api.post.infinitePosts.useInfiniteQuery(
    {
      limit: 5,
      orderBy : sort ,
      userId : userId
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor 
    },

  ); 
  const  {ref , inView} = useInView()

  return (
    <Fragment>
              <div className="flex flex-1">
                
    <div className="home-container">
    <div className='flex flex-wrap justify-center md:justify-start items-start w-full gap-4'>

              <Image src={data?.user?.image || "/assets/icons/profile-placeholder.svg"} width={1000} height={1000} alt='user' className='h-[60px] w-[60px] md:h-[150px] md:w-[150px] rounded-full object-cover'  />
              <div className='flex flex-col justify-around items-start'>
                <div className='flex gap-4 items-center justify-center'>
                <h1 className='md:h1-bold font-semibold'>{data?.user?.name}</h1>
                <FollowBtn userId={userId}/>
                </div>
              <div className='flex gap-2'>
                <p className='font-semibold'>
                  <span className='text-primary-500'>{data?.posts} </span>
                  Posts
                </p>
                <p className='font-semibold'>
                <span className='text-primary-500'>{data?.followers} </span>
                Followers
                </p>
                <p className='font-semibold'>
                <span className='text-primary-500'>{data?.following} </span>
                Following
                </p>
              </div>
              </div>
    </div>
      <div className="home-posts">
          
        <div className='flex justify-start items-center w-full px-3'>
        <Header content="User Posts" />
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
    </Fragment>
  )
}

export default Profile