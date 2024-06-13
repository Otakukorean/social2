"use client";
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "~/components/ui/dropdown-menu"
import { ListFilter } from 'lucide-react';

interface  PostsFilterProps {
    setSort : React.Dispatch<React.SetStateAction<'asc' | 'desc' | ''>>
}

const PostsFilter = ({setSort} : PostsFilterProps) => {


 
  
  return (
    <div>
        <DropdownMenu>
  <DropdownMenuTrigger className='focus:border-none ring-0'><ListFilter color='#fff'/></DropdownMenuTrigger>
  <DropdownMenuContent className='bg-black border border-dark-4'>
    <DropdownMenuLabel>Filter</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem className='cursor-pointer' onClick={() => setSort('') }>All</DropdownMenuItem>
    <DropdownMenuItem className='cursor-pointer' onClick={() => setSort('asc') }>Oldest</DropdownMenuItem>
    <DropdownMenuItem className='cursor-pointer' onClick={() => setSort('desc') }>Newest</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
    </div>
  )
}

export default PostsFilter