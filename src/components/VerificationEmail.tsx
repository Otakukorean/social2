"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect ,useState } from 'react'
import {BeatLoader} from 'react-spinners'
import { api } from '~/trpc/react';
import { useToast } from "~/components/ui/use-toast"

const VerificationEmail = () => {
  const [error, seterror] = useState<string | undefined>("")
  const searchParams = useSearchParams();
  const token = searchParams.get("token") as string;
  const router = useRouter()
  const {toast} = useToast()
  const newVerification = api.user.newVerification.useMutation({
    onSuccess :async () => {
        toast({title : "Success" , description : "your email has benn verified!"})
        await new Promise((resolve) => setTimeout(() => resolve,1500))
        router.push('/sign-in')
    }   ,
    onError :async () => {
        toast({title : "Error" , description : "Something Went Wrong"})
        await new Promise((resolve) => setTimeout(() => resolve,1500))
        router.push('/sign-in')
    }
  })
  const onSubmit =  useCallback(async () => {
    if(!token) {
      seterror("Missing token!");
      return;
    }
   await newVerification.mutateAsync({
    token : token
   })
    
  },[token])
  useEffect(() => {
    onSubmit()
  },[onSubmit])
  return (
    <div >
      
        {newVerification.isPending && (
          <div className='flex items-center w-full justify-center flex-col gap-2'>
            <h1 className='h1-semibold'>Confirming  your email...</h1>
          <BeatLoader color='#fff' />
          </div>
        ) }
        {newVerification.isSuccess  && <h1 className='h1-bold text-green-400'>your email has benn verified!</h1>}
        {error && <h1 className='h1-bold text-[#FF5A5A]'>Smoething went wrong!</h1>}
    </div>
  )
}

export default VerificationEmail