"use client";
import React, { useState } from 'react'
import { useToast } from "~/components/ui/use-toast"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "./ui/form"
  import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { redirect, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { authFormSchema } from '~/lib/utils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import Link from 'next/link';
import { api } from '~/trpc/react';
import { LoginUser } from '~/lib/action/user.login';

interface AuthFormProps {
    type : 'sign-in' | 'sign-up' | 'reset'
}
 
const AuthForm : React.FC<AuthFormProps> = ({type}) => {
    const [isLoading, setisLoading] = useState<boolean>(false)
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error" ) === 'OAuthAccountNotLinked' ? 'Email alerady used with diffrent Provider'  :''
    const formSchema = authFormSchema(type)

    const { toast } = useToast()
    const CreateUser = api.user.create.useMutation({
      onSuccess: () => {
        toast({title : 'Success', description :"Confirmation Email has been Sent!" })
        form.reset()
      } ,
      onError : (error) => {
        toast({title : 'Error', description :"Something Went Wrong!" , variant : 'destructive' })
       console.log(error);
       
      }
    })
   
    const Reset = api.reset.create.useMutation({
      onSuccess: () => {
        toast({title : 'Success', description :"Reset email sent!" })
        form.reset()
      } ,
      onError : () => {
        toast({title : 'Error', description :"Something Went Wrong!" , variant : 'destructive' })
        form.reset()
      }
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
          email : "" ,
          password : ""
        },
      })
      const onSubmit =async (values: z.infer<typeof formSchema>) => {
        try {
            setisLoading(true)
            if(type === 'sign-up'){
             await CreateUser.mutateAsync(values) 
         }
            else if(type === 'sign-in') {
              const loginuser = await LoginUser(values);
              if (loginuser?.error) toast({title : 'Error', description :loginuser.error , variant:'destructive' })
              if (loginuser?.success) toast({title : 'Success', description :loginuser.success})
              form.reset()
               
         } else {
            await Reset.mutateAsync(values);
            
            
         }
        } catch (error) {
            console.log(error);
            
        } finally {
            setisLoading(false)
        }
     
      }
   
  return (
    <section className='space-y-5 h-screen flex flex-col justify-center items-center'>
    
            <div className='flex justify-center items-center'>
                <Image src={'/assets/images/logo.svg'} width={270} height={60} alt='' />
            </div>

            <h1 className='h2-bold'>{type === 'sign-in' ? 'Sign in to your account' : type === 'sign-up' ? 'Create a new account' : 'Reset your password'} </h1>
       
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-[320px] md:w-[400px]">
        <div className=' space-y-3'>
       {type === 'sign-up' && (
               <FormField
               control={form.control}
               name="username"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel className="shad-form_label">Username</FormLabel>
                   <FormControl>
                     <Input placeholder="username" {...field} className="shad-input text-white" disabled={isLoading} />
                   </FormControl>
                   <FormMessage className="shad-form_message" />
                 </FormItem>
               )}
             />
        )}

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Email</FormLabel>
            <FormControl>
              <Input placeholder="email" {...field} className="shad-input text-white" disabled={isLoading} />
            </FormControl>
            <FormMessage className="shad-form_message" />
          </FormItem>
        )}
      />
      {type !== 'reset' && (
             <FormField
             control={form.control}
             name="password"
             render={({ field }) => (
               <FormItem>
                 <FormLabel className="shad-form_label">Password</FormLabel>
                 <FormControl>
                   <Input placeholder="password" {...field} className="shad-input text-white" type='password' disabled={isLoading}/>
                 </FormControl>
                 <FormMessage className="shad-form_message" />
               </FormItem>
             )}
           />
      )}
   
       </div>
       {
        type === 'sign-in' && (
          <Button asChild variant={'link'} className='px-0'>
          <Link href={'/auth/reset'} className='small-regular text-white/70 hover:text-white '>
           Forgot password ?
          </Link>
          </Button>
        )
       }


        <Button type='submit' className='w-full bg-primary-500' disabled={isLoading}>
          {isLoading ? <Loader2 height={24} width={24}  className='animate-spin' /> : (
            type === 'sign-in' ?  'Sign in'  : type === 'sign-up' ? 'Sign up' : 'Reset password'  
          )}
   
          </Button>
        {type === 'sign-in' && (
      <Button type='button' onClick={() => signIn('google' , {
        callbackUrl : '/'
      })} className='w-full bg-white text-black base-medium flex gap-3 justify-center items-center hover:bg-white/90'>
        <Image src={'assets/icons/google.svg'} width={24} height={24} alt='' />
        
      </Button>
    )}
    </form>
    {type === 'sign-in' && <span className='shad-form_message'>{urlError}</span>}  
  </Form>

      <footer className='flex justify-center gap-1 pt-3'>
  
      <p className='text-14 font-normal text-gray-600'>{type === 'sign-in' ? "Dont Have an account?" : type === 'sign-up' ? "Already have an account?" : 'Back to ' }</p>
      <Link href={type === "sign-in" ? "/sign-up" : "/sign-in"} className='form-link'>
              {type === "sign-in" ? "Sign Up" : type === 'sign-up' ? "Sign in" : 'Sign in'}
      </Link>
      </footer>


  </section>
  )
}

export default AuthForm