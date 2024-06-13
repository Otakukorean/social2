"use client";
import React, { useState } from 'react'
import { useToast } from "~/components/ui/use-toast"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "~/components/ui/form"
  import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
  import { Input } from "~/components/ui/input"
  import { Button } from "~/components/ui/button"
import { passwordResetSchema } from '~/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { api } from '~/trpc/react';

 
const ResetPasswordForm  = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token') as string;
    const { toast } = useToast()
    const router = useRouter()
    const form = useForm<z.infer<typeof passwordResetSchema>>({
        resolver: zodResolver(passwordResetSchema),
        defaultValues: {
          password : "" ,
          confirmPassword : ""
        },
      })
    const updatePassword = api.user.updatePassword.useMutation({
        onSuccess : () => {
         toast({title : "Success" , description : "Your password has been reset!"})
        } ,
        onError : () => {
        toast({title : "Eror" , description : "Something went wrong!",variant:"destructive"})
        }
    })
      const onSubmit =async (values: z.infer<typeof passwordResetSchema>) => {
        try {
            await updatePassword.mutateAsync({...values,token});
            await new Promise((resolve) => setTimeout(resolve, 1500));
            router.push('/sign-in')
        } catch (error) {
            console.log(error);
            
        }
     
      }
   
  return (
    <section className='space-y-5 h-screen flex flex-col justify-center items-center'>
    
            <div className='flex justify-center items-center'>
                <Image src={'/assets/images/logo.svg'} width={270} height={60} alt='' />
            </div>

            <h1 className='h2-bold'>Create a new Password!</h1>
       
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-[320px] md:w-[400px]">
        <div className=' space-y-3'>


          <FormField
             control={form.control}
             name="password"
             render={({ field }) => (
               <FormItem>
                 <FormLabel className="shad-form_label">Password</FormLabel>
                 <FormControl>
                   <Input placeholder="password" {...field} className="shad-input text-white" type='password' disabled={updatePassword.isPending}/>
                 </FormControl>
                 <FormMessage className="shad-form_message" />
               </FormItem>
             )}
           />
          <FormField
             control={form.control}
             name="confirmPassword"
             render={({ field }) => (
               <FormItem>
                 <FormLabel className="shad-form_label">Confirm Password</FormLabel>
                 <FormControl>
                   <Input placeholder="confirm Password" {...field} className="shad-input text-white" type='password' disabled={updatePassword.isPending}/>
                 </FormControl>
                 <FormMessage className="shad-form_message" />
               </FormItem>
             )}
           />
 
   
       </div>



        <Button type='submit' className='w-full bg-primary-500' disabled={updatePassword.isPending}>Reset your password</Button>

    </form>
  </Form>
  </section>
  )
}

export default ResetPasswordForm