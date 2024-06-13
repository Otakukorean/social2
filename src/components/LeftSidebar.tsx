"use client";
import Image from 'next/image';
import { sidebarLinks } from '~/constant';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '~/lib/utils';
import { Button } from './ui/button';
import { signOut } from 'next-auth/react';
const LeftSidebar =() => {
  const path = usePathname();
  return (
    <nav className='leftsidebar' >

      <div className='flex flex-col gap-11'>
      <Link href={'/'} className='flex gap-3 items-center'>
                <Image src={'/assets/images/logo.svg'} width={170} height={36} alt='' />

            </Link>
      <ul className='flex flex-col gap-6'>
          {sidebarLinks.map((link) => {
            const isActive = path.endsWith(link.route);
            return (
              <li className={cn('leftsidebar-link')} key={link.route}>
              <Link href={link.route} className={cn('flex gap-4 items-center p-4 rounded-[8px]',isActive && 'bg-primary-500')} >
                <Image src={link.imgURL} alt='' width={24} height={24} className={cn('group-hover:invert-white' , isActive && 'invert-white')} />
                {link.label}
              </Link>
              </li>
            )
          })}
      </ul>
        </div>

        <Button variant={'ghost'} className='shad-button_ghost' onClick={() => signOut({callbackUrl : '/sign-in'})}>
            <Image src={'/assets/icons/logout.svg'} alt='logout' width={24} height={24} />
            <p className='small-medium lg:base-medium'>Logout</p>
        </Button>

    </nav>
  )
}

export default LeftSidebar;
