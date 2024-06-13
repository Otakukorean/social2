"use client";
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import MobileNav from './MobileNav'
import { Button } from './ui/button'
import { signOut } from 'next-auth/react';

const TopBar = () => {
  return (
    <section className='topbar'>
        <div className='flex-between py-4 px-5'>
            <Link href={'/'} className='flex gap-3 items-center'>
                <Image src={'/assets/images/logo.svg'} width={130} height={325} alt='' />

            </Link>
            <div className='flex justify-center items-center gap-2'>
            <Button variant={'ghost'} className='shad-button_ghost' onClick={() => signOut({callbackUrl : '/sign-in'})}>
            <Image src={'/assets/icons/logout.svg'} alt='logout' width={24} height={24} />
            </Button>
            <MobileNav />
            </div>
      
        </div>

    </section>
  )
}

export default TopBar