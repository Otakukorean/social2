"use client";
import React from 'react'
import {Sheet,SheetContent,SheetHeader,SheetDescription,SheetTitle,SheetTrigger, SheetClose} from '~/components/ui/sheet'
import Image from 'next/image'
import Link from 'next/link'
import { sidebarLinks } from '~/constant'
import { usePathname } from 'next/navigation'
import { cn } from '~/lib/utils';
const MobileNav = () => {
  const pathname = usePathname()

  return (
    <section className='max-w-[264px]'>
      <Sheet >
        <SheetTrigger>
         <Image src={'/assets/icons/hamburger.svg'} width={30} height={30} alt='menu' className='cursor-pointer' />
        </SheetTrigger>
        <SheetContent side={'left'}
        className='border-none bg-black'
        >
     
            <Link href={'/'} className='flex cursor-pointer items-center gap-1 px-4'>
                <Image src={'/assets/images/logo.svg'} height={130} width={200} alt='image' />
            </Link> 
            <div className='mobilenav-sheet'>
              <SheetClose asChild>
                <nav className='flex h-full flex-col gap-6 pt-16 text-white'>
                {sidebarLinks.map((link) => {
                const isActive = link.route === pathname || pathname.startsWith(`${link.route}/`)
                return (
                  <SheetClose asChild key={link.route}>
                     <Link href={link.route} className={cn('flex gap-4 items-center p-4 rounded-[8px]',isActive && 'bg-primary-500')} >
                <Image src={link.imgURL} alt='' width={24} height={24} className={cn('group-hover:invert-white' , isActive && 'invert-white')} />
                {link.label}
                </Link>
                  </SheetClose>
               
                )
            })}
     
                </nav>
              </SheetClose>
          
            </div>
       
        
  
        </SheetContent>
   
      </Sheet>
    </section>
  )
}

export default MobileNav