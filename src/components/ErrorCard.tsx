import Image from 'next/image'
import React from 'react'

const ErrorCard = () => {
  return (
    <div className='flex flex-col h-screen justify-center items-center gap-3 '>
        <Image src={'/assets/icons/error.gif'} width={400} height={400} alt="error" />
        <h1 className='h2-bold text-rose-700 '>Something Went Wrong!</h1>
    </div>
  )
}

export default ErrorCard