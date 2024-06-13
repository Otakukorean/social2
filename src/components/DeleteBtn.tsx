"use client";
import { useQueryClient } from '@tanstack/react-query';
import { Trash } from 'lucide-react';
import React from 'react'
import { api } from '~/trpc/react';
import {
    Credenza,
    CredenzaBody,
    CredenzaClose,
    CredenzaContent,
    CredenzaDescription,
    CredenzaFooter,
    CredenzaHeader,
    CredenzaTitle,
    CredenzaTrigger,
  } from "~/components/ui/credenza"
import { Button } from './ui/button';
interface DeleteBtnProps {
    postId : string;
}
const DeleteBtn = ({postId} : DeleteBtnProps) => {
    const queryClient = useQueryClient()
    const Delete = api.post.delete.useMutation()
    const onClick =async () => {
        await Delete.mutateAsync({
            postId : postId
        })
        queryClient.invalidateQueries()
    }
  return (


        <Credenza>
  <CredenzaTrigger asChild>
  <Trash color='#ef4444' className='cursor-pointer' size={20}  />
  </CredenzaTrigger>
  <CredenzaContent className='bg-white text-black'>
    <CredenzaHeader>
      <CredenzaTitle className='text-destructive'>Warrning</CredenzaTitle>
      <CredenzaDescription>
         you will to delete that Post
      </CredenzaDescription>
    </CredenzaHeader>
    <CredenzaBody>
        Are You sure you want to delete that Post!
    </CredenzaBody>
    <CredenzaFooter>
      <CredenzaClose asChild>
        <Button className='bg-black'>Close</Button>
      </CredenzaClose>
      <CredenzaClose asChild>
        <Button onClick={onClick} variant={'destructive'}>Delete</Button>
        </CredenzaClose>
    </CredenzaFooter>
  </CredenzaContent>
</Credenza>

  )
}



export default DeleteBtn