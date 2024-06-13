"use client";
import AuthForm from "~/components/AuthForm"
import { api } from "~/trpc/react";

const SignInPage = () => {
  return (
    <>
    <AuthForm type='sign-in' />

    </>

  )
}

export default SignInPage