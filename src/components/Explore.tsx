"use client";
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input';
import PostsFilter from './PostsFilter';
import { api } from '~/trpc/react';
import { Loader2 } from 'lucide-react';
import { BentoGrid, BentoGridItem } from './ui/bento-grid';
import {useInView} from 'react-intersection-observer'
import useDebounce from '~/hooks/useDebounce';

const Explore = () => {
  const [sort,setSort] = useState<'asc' | 'desc' | ''>('')
  const [search,setSearch] = useState<string>("")
  const debouncedSearch = useDebounce(search , 1000)
  const Explore = api.post.infinitePosts.useInfiniteQuery(
    {
      limit: 5,
      orderBy : sort ,
      search : search
      
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor 
    },

  ); 
  const  {ref , inView} = useInView()
  useEffect(() => {
    const fetchNextPage = async () => {
        if(inView && Explore.hasNextPage){
            await Explore.fetchNextPage()
        }
    }
    fetchNextPage()
  },[inView])
useEffect(() => {
    const refetch = async () => {
        await Explore.refetch()
    }
    refetch()
  },[sort,debouncedSearch])
  return (
    <div className="explore-container">
    <div className="explore-inner_container">
      <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
      <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
        <Image
          src="/assets/icons/search.svg"
          width={24}
          height={24}
          alt="search"
        />
        <Input
          type="text"
          placeholder="Search"
          className="explore-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>

    <div className="flex-between w-full  mt-16 mb-7">
      <h3 className="body-bold md:h3-bold">Popular Today</h3>

      <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
        <p className="small-medium md:base-medium text-light-2">{sort === 'desc' ? "Newest" : sort === 'asc' ? 'Oldest' : 'All'}</p>
        <PostsFilter setSort={setSort} />
      </div>
    </div>


    <div className='w-full'>
    {!Explore.isLoading ? (
              <ul className="flex flex-col flex-1 gap-9 w-full ">
              {Explore.data?.pages.map((posts) => (
                <BentoGrid>
                  {  posts.items.map((post,i) => (
                      <BentoGridItem 
                        images={post.Image}
                        className={i % 4 == 0 || i % 3 == 0 || i === 1 ? "md:col-span-2" : ""}
                        id={post.id}
                      />
                  ))}
                    </BentoGrid>
              ))}
         
          </ul>
        ): <Loader2 color='#877EFF' className='animate-spin' size={25}  />}
        <span className="" ref={ref} style={{visibility : "hidden"}}>fetch</span>
        {Explore.isFetchingNextPage && <Loader2 color='#877EFF' className='animate-spin' size={25}  />} 
    </div>

  
    </div>


  )
}

export default Explore