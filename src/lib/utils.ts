import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const authFormSchema =(type : "sign-in" | 'sign-up'  | 'reset') => z.object({
  // sign up 
  username : type === 'sign-in' || type ===  'reset' ? z.string().optional() : z.string().min(3, {
    message: 'The Username is too short'
  }), 
  email : z.string().email({
    message : "Email is Required!"
  }),
  password :type === 'reset' ? z.string().optional() :  z.string().min(6 , {
    message : "The Password is too short"
  }) ,
})

export  const PostValidation = z.object({
  caption: z.string().min(5, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  location: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 1000 characters." }),
  tags: z.string(),
  images : z.object({ url: z.string() }).array()
});

export const passwordResetSchema = z
.object({
  password: z.string(),
  confirmPassword: z.string(),
  token : z.string()
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});
export const emailVerificationSchema = z
.object({
  token : z.string()
})

export function exclude(user : any, ...keys : any) {
  for (let key of keys) {
    delete user[key]
  }
  return user
}
