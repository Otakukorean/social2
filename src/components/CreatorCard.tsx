"use client";
import Image from 'next/image';
import React from 'react'
import { Button } from './ui/button';
import Link from 'next/link';
import FollowBtn from './FollowBtn';

interface TopCreatorCardProps {
    id : string;
    image : string;
    name : string;
}

const CreatorCard = ({id,image,name} : TopCreatorCardProps) => {
  return (
    <div className='bg-transparent p-5 flex flex-col justify-center w-[190px] h-[190px] items-center gap-3 border border-dark-4 rounded-[20px]'>
      <Link href={`/profile/${id}`}>
        <Image src={image} width={55} height={55} alt="user" className='rounded-[27px]' />
      </Link>
        <h3 lang='base-semibold'>{name}</h3>
        <FollowBtn userId={id} />
    </div>
  )
}

export default CreatorCard